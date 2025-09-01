// AI description generation service (mocked for prototype)
export interface AiSuggestionRequest {
  matterId?: number
  duration: number
  source: 'Calendar' | 'Email' | 'Timer' | 'API'
  context?: string // calendar subject, email subject, etc.
}

export interface AiSuggestionResponse {
  description: string
  confidence: number
  alternatives: string[]
}

export class AiService {
  // Mock AI service - in real implementation would call Copilot/OpenAI
  static async generateDescription(request: AiSuggestionRequest): Promise<AiSuggestionResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Mock descriptions based on matter patterns
    const mockDescriptions = {
      research: 'Research and analysis of legal precedents',
      meeting: 'Client consultation and strategy discussion', 
      drafting: 'Preparation and review of legal documentation',
      court: 'Court appearance and procedural matters',
      email: 'Client correspondence and communication',
      review: 'Document review and legal analysis'
    }
    
    // Simple context-based selection
    const context = request.context?.toLowerCase() || ''
    let description = mockDescriptions.research // default
    
    if (context.includes('meeting') || context.includes('call')) {
      description = mockDescriptions.meeting
    } else if (context.includes('draft') || context.includes('document')) {
      description = mockDescriptions.drafting  
    } else if (context.includes('court') || context.includes('hearing')) {
      description = mockDescriptions.court
    } else if (context.includes('email') || context.includes('correspondence')) {
      description = mockDescriptions.email
    } else if (context.includes('review')) {
      description = mockDescriptions.review
    }
    
    // Add duration context
    const hours = Math.round(request.duration / 60 * 10) / 10
    const durationContext = hours >= 2 ? ' (extended session)' : hours <= 0.5 ? ' (brief)' : ''
    
    return {
      description: description + durationContext,
      confidence: 0.85,
      alternatives: [
        'Legal research and case analysis',
        'Client matter consultation',
        'Document preparation and review'
      ]
    }
  }

  // Extract matter ID from calendar/email subjects like "[12345] Client Meeting"  
  static extractMatterId(subject: string): number | null {
    const match = subject.match(/\[(\d+)\]/)
    return match ? parseInt(match[1]) : null
  }

  // Generate merged description for bulk operations
  static async generateMergedDescription(entries: Array<{description?: string, duration: number}>): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const totalMinutes = entries.reduce((sum, e) => sum + e.duration, 0)
    const hours = Math.round(totalMinutes / 60 * 10) / 10
    
    // Analyze existing descriptions for common themes
    const descriptions = entries.map(e => e.description || '').filter(Boolean)
    const hasResearch = descriptions.some(d => d.toLowerCase().includes('research'))
    const hasMeeting = descriptions.some(d => d.toLowerCase().includes('meeting') || d.toLowerCase().includes('call'))
    const hasDrafting = descriptions.some(d => d.toLowerCase().includes('draft') || d.toLowerCase().includes('document'))
    
    let merged = 'Combined legal work including '
    const activities = []
    
    if (hasResearch) activities.push('research and analysis')
    if (hasMeeting) activities.push('client consultation')  
    if (hasDrafting) activities.push('document preparation')
    
    if (activities.length === 0) {
      merged = `Legal services and consultation (${hours} hours total)`
    } else {
      merged += activities.join(', ') + ` (${hours} hours total)`
    }
    
    return merged
  }
}
