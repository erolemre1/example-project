import { generateId } from '@/utils/store-utils'
import type {
    TemplateElement,
    ElementType,
    HeadingElement,
    TextElement,
    ButtonElement,
    ImageElement,
    DividerElement,
} from '@/types'

const DefaultElements: TemplateElement[] = [
    {
        id: generateId(),
        type: 'heading',
        content: 'Welcome to Our Store',
        fontSize: 28,
        color: '#000000',
        alignment: 'center',
        position: { x: 50, y: 40 },
        size: { width: 300, height: 40 },
        zIndex: 1,
    } as HeadingElement,
    {
        id: generateId(),
        type: 'text',
        content: 'Get 20% off your first order when you subscribe to our newsletter!',
        fontSize: 14,
        color: '#4b5563',
        alignment: 'center',
        position: { x: 50, y: 100 },
        size: { width: 300, height: 50 },
        zIndex: 2,
    } as TextElement,
    {
        id: generateId(),
        type: 'divider',
        color: '#d1d5db',
        thickness: 1,
        position: { x: 75, y: 170 },
        size: { width: 250, height: 2 },
        zIndex: 3,
    } as DividerElement,
    {
        id: generateId(),
        type: 'image',
        url: '',
        altText: '150 x 120',
        position: { x: 125, y: 200 },
        size: { width: 150, height: 120 },
        zIndex: 4,
    } as ImageElement,
    {
        id: generateId(),
        type: 'button',
        text: 'Subscribe Now',
        backgroundColor: '#4f46e5',
        textColor: '#FFFFFF',
        borderRadius: 8,
        position: { x: 115, y: 360 },
        size: { width: 170, height: 48 },
        zIndex: 5,
    } as ButtonElement,
]

export default DefaultElements