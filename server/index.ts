import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'templates.json')

app.use(cors())
app.use(express.json({ limit: '5mb' }))

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
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, '[]', 'utf-8')
        return []
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(data)
}

function writeTemplates(templates: Template[]): void {
    fs.writeFileSync(DATA_FILE, JSON.stringify(templates, null, 2), 'utf-8')
}

app.get('/api/templates', (_req, res) => {
    const templates = readTemplates()
    res.json(templates)
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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
