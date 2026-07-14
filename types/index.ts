export interface Video {
    id: string
    title: string
    description: string | null
    publicId: string
    originalSize: string
    compressedSize: string
    duration: number
    isFavorite: boolean
    summary: string | null
    tags: string[]
    category: string | null
    folderId: string | null
    publicShare: boolean
    shareExpiresAt: string | null
    createdAt: string
    updatedAt: string
}

export interface Folder {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    videos?: Video[]
}

export interface Activity {
    id: string
    action: string
    details: string
    createdAt: string
}
