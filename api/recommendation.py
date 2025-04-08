import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

# Load your dataset
df = pd.read_csv('Books_Data_300_Filtered.csv')

# Fill missing values
df['combined'] = (df['Title'].fillna('') + ' ' +
                  df['Author'].fillna('') + ' ' +
                  df['Department'].fillna(''))

# TF-IDF vectorizer
tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(df['combined'])

# Compute similarity matrix
cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

# Map book titles to indices
indices = pd.Series(df.index, index=df['Title']).drop_duplicates()

def get_recommendations(title, num=5):
    idx = indices.get(title)
    if idx is None:
        return []

    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:num+1]
    book_indices = [i[0] for i in sim_scores]
    return df.iloc[book_indices][['Title', 'Author', 'Department']].to_dict('records')
