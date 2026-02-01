import { Document, Page, StyleSheet, Text, View, renderToBuffer } from '@react-pdf/renderer'

interface BriefPdfInput {
  title: string
  generatedAt: string
  sections: Record<string, string>
  citations: Array<{ id: string; title: string; url: string }>
  decisionChangers: Array<{ condition: string; wouldFavor: string; likelihood: string }>
}

const sectionOrder = [
  { key: 'recommendation', title: 'Recommendation' },
  { key: 'framing', title: 'Framing' },
  { key: 'optionsConsidered', title: 'Options Considered' },
  { key: 'evidenceSummary', title: 'Evidence Summary' },
  { key: 'assumptionsLedger', title: 'Assumptions Ledger' },
  { key: 'openQuestions', title: 'Open Questions' },
  { key: 'metadata', title: 'Metadata' },
] as const

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    lineHeight: 1.4,
  },
  heading: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 6,
  },
  subheading: {
    fontSize: 12,
    fontWeight: 600,
    marginTop: 16,
    marginBottom: 6,
  },
  paragraph: {
    marginBottom: 8,
  },
  muted: {
    color: '#5f6368',
  },
  section: {
    marginBottom: 10,
  },
  footnote: {
    fontSize: 9,
    marginBottom: 4,
  },
  listItem: {
    marginBottom: 4,
  },
})

const replaceCitationMarkers = (text: string, map: Record<string, number>) =>
  text.replace(/\[E(\d+)\]/g, (_, id) => {
    const key = `E${id}`
    return map[key] ? `[${map[key]}]` : `[${key}]`
  })

export async function generateBriefPdf(input: BriefPdfInput): Promise<Buffer> {
  const citationMap = input.citations.reduce<Record<string, number>>((acc, citation, index) => {
    acc[citation.id] = index + 1
    return acc
  }, {})

  const sections = sectionOrder
    .map((section) => ({
      title: section.title,
      content: input.sections[section.key] ?? '',
    }))
    .filter((section) => section.content)

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading}>{input.title}</Text>
        <Text style={[styles.paragraph, styles.muted]}>
          Generated on {new Date(input.generatedAt).toLocaleDateString()}
        </Text>

        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.subheading}>{section.title}</Text>
            <Text style={styles.paragraph}>
              {replaceCitationMarkers(section.content, citationMap)}
            </Text>
          </View>
        ))}

        {input.decisionChangers.length ? (
          <View style={styles.section}>
            <Text style={styles.subheading}>Decision Changers</Text>
            {input.decisionChangers.map((changer, index) => (
              <Text key={`${changer.condition}-${index}`} style={styles.listItem}>
                • {changer.condition} (would favor {changer.wouldFavor}, {changer.likelihood})
              </Text>
            ))}
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.subheading}>Citations</Text>
          {input.citations.map((citation, index) => (
            <Text key={citation.id} style={styles.footnote}>
              [{index + 1}] {citation.title} — {citation.url}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  )

  return renderToBuffer(doc)
}
