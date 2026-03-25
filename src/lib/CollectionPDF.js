import { LANGUAGE_LABEL } from '@/enums/language';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts for Hindi support (ensure you have the .ttf files in your public folder)
// If you don't have local files, you can use a hosted URL
Font.register({
  family: 'NotoSansDevanagari',
  src: `http://fonts.cdnfonts.com/css/noto-sans-devanagari-ui`,
});


const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica' },
  header: { marginBottom: 20, borderBottom: 1, pb: 10 },
  title: { fontSize: 18, fontWeight: 'bold' },
  meta: { fontSize: 9, color: '#666', marginTop: 4 },
  questionContainer: { marginBottom: 20, padding: 10, borderBottomWidth: 0.5, borderColor: '#eee' },
  qHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  qCode: { fontWeight: 'bold', fontSize: 8, color: '#0070f3' },
  contentRow: { flexDirection: 'row', gap: 20 },
  langBlock: { flex: 1 },
  langLabel: { fontSize: 7, textTransform: 'uppercase', color: '#999', marginBottom: 4 },
  text: { fontSize: 11, marginBottom: 8, lineHeight: 1.4 },
  hindiText: { fontFamily: 'NotoSansDevanagari', fontSize: 9 },
  option: { marginLeft: 10, marginBottom: 4, flexDirection: 'row' },
  bullet: { width: 15, fontWeight: 'bold' },
  solution: { marginTop: 10, padding: 8, backgroundColor: '#f0f9ff', borderRadius: 4 },
  solTitle: { fontSize: 8, fontWeight: 'bold', color: '#0369a1', marginBottom: 2 }
});

export const CollectionPDF = ({ data, config }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{data.collectionTitle}</Text>
        <Text style={styles.meta}>Total Questions: {data.totalQuestions} | Export Date: {new Date().toLocaleDateString()}</Text>
      </View>

      {/* Questions List */}
      {data.data.map((q, idx) => (
        <View key={q.id} style={styles.questionContainer} wrap={false}>
          <View style={styles.qHeader}>
            <Text style={styles.qCode}>Q.{idx + 1} | {q.code}</Text>
            <Text style={styles.meta}>{q.difficulty}</Text>
          </View>

          <View style={styles.contentRow}>
            {config.selectedLanguages.map(lang => (
              <View key={lang} style={styles.langBlock}>
                <Text style={styles.langLabel}>{LANGUAGE_LABEL[lang]}</Text>
                
                {/* Question Text */}
                <Text style={[styles.text, lang === 'hi' ? styles.hindiText : {}]}>
                  {q.content[lang]?.text}
                </Text>

                {/* Options */}
                {q.content[lang]?.options.map((opt, oIdx) => (
                  <View key={oIdx} style={styles.option}>
                    <Text style={styles.bullet}>{String.fromCharCode(65 + oIdx)}.</Text>
                    <Text style={lang === 'hi' ? styles.hindiText : {}}>{opt.text}</Text>
                  </View>
                ))}

                {/* Solution (Conditional) */}
                {config.contentMode === 'full' && q.content[lang]?.solution && (
                  <View style={styles.solution}>
                    <Text style={styles.solTitle}>Solution:</Text>
                    <Text style={[styles.meta, lang === 'hi' ? styles.hindiText : {}]}>
                      {q.content[lang].solution}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      ))}
    </Page>
  </Document>
);