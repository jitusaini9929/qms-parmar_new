/**
 * Formats collection data for export
 * @param {Object} collection - The collection document with questions populated
 * @param {Object} config - { selectedLanguages: [], contentMode: 'minimal' | 'full' }
 */
export const formatCollectionForExport = (collection, config) => {
  const { selectedLanguages, contentMode } = config;

  const formattedQuestions = collection.questions.map((q, index) => {
    const questionBlock = {
      id: q._id,
      code: q.code,
      index: index + 1,
      difficulty: q.difficulty,
      tags: q.tags,
      // Grouping content by selected languages
      content: {}
    };

    selectedLanguages.forEach(lang => {
      if (q.content && q.content[lang]) {
        const langData = q.content[lang];
        
        questionBlock.content[lang] = {
          passage: langData.passage,
          text: langData.text,
          options: langData.options.map(opt => ({
            text: opt.text,
            isCorrect: contentMode === 'full' ? opt.correctOption : undefined
          }))
        };

        // Include Solution and Description only in 'full' mode
        if (contentMode === 'full') {
          questionBlock.content[lang].solution = langData.solution;
          questionBlock.content[lang].description = langData.description;
        }
      }
    });

    return questionBlock;
  });

  return {
    collectionTitle: collection.title,
    exportDate: new Date().toISOString(),
    totalQuestions: formattedQuestions.length,
    languagesIncluded: selectedLanguages,
    data: formattedQuestions
  };
};