// Mock source data simulation (Calendar, Email, Timer)
import type { TimeEntry } from '../types'
import { AiService } from './aiService'

export interface SourceEntry {
  id: string
  source: 'Calendar' | 'Email' | 'Timer' | 'API'
  rawData: any
  detectedMatter?: string
  parsedDuration?: number
  context?: string
}

export class SourceService {
  // Mock calendar entries with matter detection
  static generateCalendarEntries(): SourceEntry[] {
    const mockCalendarEvents = [
      {
        id: 'cal-1',
        subject: '[12345] Client Strategy Meeting',
        start: '2025-01-15T10:00:00',
        end: '2025-01-15T11:30:00',
        attendees: ['client@example.com', 'lawyer@firm.com']
      },
      {
        id: 'cal-2', 
        subject: 'Research Contract Law [67890]',
        start: '2025-01-15T14:00:00',
        end: '2025-01-15T16:00:00',
        attendees: ['lawyer@firm.com']
      },
      {
        id: 'cal-3',
        subject: 'Team Standup', // No matter detected
        start: '2025-01-15T09:00:00',
        end: '2025-01-15T09:30:00',
        attendees: ['team@firm.com']
      },
      {
        id: 'cal-4',
        subject: '[12345] Document Review Session',
        start: '2025-01-16T13:00:00',
        end: '2025-01-16T15:30:00',
        attendees: ['paralegal@firm.com', 'lawyer@firm.com']
      }
    ]

    return mockCalendarEvents.map(event => {
      const matterId = AiService.extractMatterId(event.subject)
      const durationMs = new Date(event.end).getTime() - new Date(event.start).getTime()
      const durationMinutes = Math.round(durationMs / (1000 * 60))

      return {
        id: event.id,
        source: 'Calendar' as const,
        rawData: event,
        detectedMatter: matterId?.toString(),
        parsedDuration: durationMinutes,
        context: event.subject
      }
    }).filter(entry => entry.detectedMatter) // Only include entries with detected matters
  }

  // Mock email entries
  static generateEmailEntries(): SourceEntry[] {
    const mockEmails = [
      {
        id: 'email-1',
        subject: 'RE: [12345] Contract Questions',
        from: 'client@example.com',
        timestamp: '2025-01-15T11:45:00',
        estimatedTime: 15 // minutes estimated to read/respond
      },
      {
        id: 'email-2',
        subject: 'Case Update - Matter [67890]',
        from: 'paralegal@firm.com', 
        timestamp: '2025-01-15T16:30:00',
        estimatedTime: 10
      }
    ]

    return mockEmails.map(email => {
      const matterId = AiService.extractMatterId(email.subject)
      
      return {
        id: email.id,
        source: 'Email' as const,
        rawData: email,
        detectedMatter: matterId?.toString(),
        parsedDuration: email.estimatedTime,
        context: email.subject
      }
    }).filter(entry => entry.detectedMatter)
  }

  // Mock timer entries
  static generateTimerEntries(): SourceEntry[] {
    const mockTimers = [
      {
        id: 'timer-1',
        description: 'Research for matter 12345',
        startTime: '2025-01-15T08:00:00',
        endTime: '2025-01-15T09:15:00',
        project: 'Legal Research'
      },
      {
        id: 'timer-2',
        description: 'Document drafting [67890]',
        startTime: '2025-01-16T10:00:00',
        endTime: '2025-01-16T12:30:00',
        project: 'Document Prep'
      }
    ]

    return mockTimers.map(timer => {
      const matterId = AiService.extractMatterId(timer.description)
      const durationMs = new Date(timer.endTime).getTime() - new Date(timer.startTime).getTime()
      const durationMinutes = Math.round(durationMs / (1000 * 60))

      return {
        id: timer.id,
        source: 'Timer' as const,
        rawData: timer,
        detectedMatter: matterId?.toString(),
        parsedDuration: durationMinutes,
        context: timer.description
      }
    }).filter(entry => entry.detectedMatter)
  }

  // Convert source entries to draft time entries
  static async convertToDraftEntries(sourceEntries: SourceEntry[]): Promise<TimeEntry[]> {
    const drafts: TimeEntry[] = []

    for (const source of sourceEntries) {
      // Generate AI description based on source context
      const aiResponse = await AiService.generateDescription({
        matterId: parseInt(source.detectedMatter || '0'),
        duration: source.parsedDuration || 0,
        source: source.source,
        context: source.context
      })

      const draft: TimeEntry = {
        id: `draft-${source.id}`,
        date: this.extractDate(source),
        matter: source.detectedMatter || '',
        description: aiResponse.description,
        minutes: source.parsedDuration || 0,
        status: 'draft',
        sourceType: source.source,
        // Additional metadata for traceability
        calendarEventId: source.source === 'Calendar' ? source.id : undefined
      }

      drafts.push(draft)
    }

    return drafts
  }

  // Extract date from source entry
  private static extractDate(source: SourceEntry): string {
    if (source.source === 'Calendar') {
      return source.rawData.start
    } else if (source.source === 'Email') {
      return source.rawData.timestamp
    } else if (source.source === 'Timer') {
      return source.rawData.startTime
    }
    return new Date().toISOString()
  }

  // Simulate full sync process
  static async performSync(): Promise<TimeEntry[]> {
    console.log('🔄 Starting sync from all sources...')
    
    // Simulate API delays
    await new Promise(resolve => setTimeout(resolve, 1200))
    
    const calendarEntries = this.generateCalendarEntries()
    const emailEntries = this.generateEmailEntries()  
    const timerEntries = this.generateTimerEntries()
    
    const allSources = [...calendarEntries, ...emailEntries, ...timerEntries]
    console.log(`📅 Found ${calendarEntries.length} calendar, ${emailEntries.length} email, ${timerEntries.length} timer entries with detected matters`)
    
    return await this.convertToDraftEntries(allSources)
  }
}
