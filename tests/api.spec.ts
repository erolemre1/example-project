/**
 * @jest-environment node
 */
import express from 'express'
import request from 'supertest'
import fs from 'fs'
import path from 'path'

function createApp(dataFile: string) {
  const app = express()
  app.use(express.json())

  interface Template {
    id: string
    name: string
    elements: unknown[]
    canvasSize: { width: number; height: number }
    backgroundColor: string
    createdAt: string
    updatedAt: string
  }

  function readTemplates(): Template[] {
    if (!fs.existsSync(dataFile)) {
      fs.writeFileSync(dataFile, '[]', 'utf-8')
      return []
    }
    return JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
  }

  function writeTemplates(templates: Template[]): void {
    fs.writeFileSync(dataFile, JSON.stringify(templates, null, 2), 'utf-8')
  }

  app.get('/api/templates', (_req, res) => {
    res.json(readTemplates())
  })

  app.post('/api/templates', (req, res) => {
    const template = req.body as Template
    if (!template.id || !template.name) {
      res.status(400).json({ error: 'Template must have id and name' })
      return
    }
    const templates = readTemplates()
    const existingIndex = templates.findIndex((t) => t.id === template.id)
    template.updatedAt = new Date().toISOString()
    if (existingIndex >= 0) {
      templates[existingIndex] = template
    } else {
      template.createdAt = new Date().toISOString()
      templates.push(template)
    }
    writeTemplates(templates)
    res.json(template)
  })

  app.delete('/api/templates/:id', (req, res) => {
    const { id } = req.params
    const templates = readTemplates()
    const filtered = templates.filter((t) => t.id !== id)
    if (filtered.length === templates.length) {
      res.status(404).json({ error: 'Template not found' })
      return
    }
    writeTemplates(filtered)
    res.status(204).send()
  })

  return app
}

describe('API Endpoints', () => {
  const testFile = path.join(__dirname, 'test-templates.json')
  let app: express.Express

  beforeEach(() => {
    fs.writeFileSync(testFile, '[]', 'utf-8')
    app = createApp(testFile)
  })

  afterAll(() => {
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile)
    }
  })

  it('GET /api/templates should return empty array initially', async () => {
    const res = await request(app).get('/api/templates')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  it('POST /api/templates should create a new template', async () => {
    const template = {
      id: 'test-1',
      name: 'Test Template',
      elements: [],
      canvasSize: { width: 400, height: 500 },
      backgroundColor: '#FFFFFF',
    }

    const res = await request(app).post('/api/templates').send(template)
    expect(res.status).toBe(200)
    expect(res.body.id).toBe('test-1')
    expect(res.body.name).toBe('Test Template')
    expect(res.body.updatedAt).toBeDefined()
  })

  it('POST /api/templates should update an existing template', async () => {
    const template = {
      id: 'test-1',
      name: 'Original',
      elements: [],
      canvasSize: { width: 400, height: 500 },
      backgroundColor: '#FFFFFF',
    }
    await request(app).post('/api/templates').send(template)

    const updated = { ...template, name: 'Updated' }
    const res = await request(app).post('/api/templates').send(updated)
    expect(res.body.name).toBe('Updated')

    const listRes = await request(app).get('/api/templates')
    expect(listRes.body).toHaveLength(1)
    expect(listRes.body[0].name).toBe('Updated')
  })

  it('DELETE /api/templates/:id should remove a template', async () => {
    const template = {
      id: 'test-del',
      name: 'To Delete',
      elements: [],
      canvasSize: { width: 400, height: 500 },
      backgroundColor: '#FFFFFF',
    }
    await request(app).post('/api/templates').send(template)

    const res = await request(app).delete('/api/templates/test-del')
    expect(res.status).toBe(204)

    const listRes = await request(app).get('/api/templates')
    expect(listRes.body).toHaveLength(0)
  })

  it('DELETE /api/templates/:id should return 404 for non-existent', async () => {
    const res = await request(app).delete('/api/templates/nonexistent')
    expect(res.status).toBe(404)
  })

  it('POST /api/templates should reject template without id', async () => {
    const res = await request(app).post('/api/templates').send({ name: 'No ID' })
    expect(res.status).toBe(400)
  })
})
