export enum ElementType {
    HEADING = 'heading',
    TEXT = 'text',
    BUTTON = 'button',
    IMAGE = 'image',
    DIVIDER = 'divider'
}

export enum Alignment {
    LEFT = 'left',
    CENTER = 'center',
    RIGHT = 'right'
}

export type Position = {
    x: number
    y: number
}

export type Size = {
    width: number
    height: number
}

export interface BaseElement {
    id: string
    type: ElementType
    position: Position
    zIndex: number
    size: Size
}

export interface HeadingElement extends BaseElement {
    type: ElementType.HEADING
    content: string
    fontSize: number
    color: string
    alignment: Alignment
}

export interface TextElement extends BaseElement {
    type: ElementType.TEXT
    content: string
    fontSize: number
    color: string
    alignment: Alignment
}

export interface ButtonElement extends BaseElement {
    type: ElementType.BUTTON
    text: string
    backgroundColor: string
    textColor: string
    borderRadius: number
}

export interface ImageElement extends BaseElement {
    type: ElementType.IMAGE
    url: string
    altText: string
}

export interface DividerElement extends BaseElement {
    type: ElementType.DIVIDER
    color: string
    thickness: number
}

export type TemplateElement =
    | HeadingElement
    | TextElement
    | ButtonElement
    | ImageElement
    | DividerElement

export interface Template {
    id: string;
    name: string;
    elements: TemplateElement[];
    createdAt: string;
    updatedAt: string;
}

export interface ApiResponse<T = unknown> {
    success: boolean
    data?: T
    error?: string | null
    message?: string
    status: number
}