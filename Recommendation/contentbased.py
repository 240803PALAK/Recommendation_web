import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import sigmoid_kernel
import requests
import random
def fetch_poster(movie_id):
    response=requests.get(f'https://api.themoviedb.org/3/movie/{movie_id}?api_key=db3c9fedfe72ff44b24cf7d48ae3068e&language=en-US')
    data=response.json()
    return "https://image.tmdb.org/t/p/w500"+data['poster_path']
credits=pd.read_csv("static/tmdb_5000_credits.csv")
movies_df=pd.read_csv("static/tmdb_5000_movies.csv")

credits_column_renamed=credits.rename(index=str,columns={"movie_id":"id"})
movies_df_merge=movies_df.merge(credits_column_renamed,on='id')

movies_cleaned_df=movies_df_merge.drop(columns=["homepage","title_x","title_y","status","production_countries"])
movies_cleaned_df['original_title']=movies_cleaned_df['original_title'].str.lower()

movies_cleaned_df.head(1)['overview']

tfv=TfidfVectorizer(min_df=3,max_features=None,
                  strip_accents='unicode',analyzer='word',token_pattern=r'\w{1,}',
                  ngram_range=(1,3),
                  stop_words='english')
movies_cleaned_df['overview']=movies_cleaned_df['overview'].fillna('')

tfv_matrix=tfv.fit_transform(movies_cleaned_df['overview'])

sig=sigmoid_kernel(tfv_matrix,tfv_matrix)

indices=pd.Series(movies_cleaned_df.index,index=movies_cleaned_df['original_title']).drop_duplicates()

def give_rec(title,sig=sig):
    title=title.lower()
    idx=indices[title]
    sig_scores=list(enumerate(sig[idx]))
    sig_scores=sorted(sig_scores,key=lambda x:x[1],reverse=True)
    sig_scores=sig_scores[1:11]
    movies_indices=[i[0] for i in sig_scores]
    return movies_cleaned_df['original_title'].iloc[movies_indices]

def recommendation(movie_name):
    result=[]
    movie_id=[]
    movie_path=[]
    movies=give_rec(movie_name)
    for movie in movies:
        result.append(movie)
        movie_index = movies_cleaned_df[movies_cleaned_df['original_title'] == movie].index[0]
        movie_id.append(movies_cleaned_df.loc[movie_index, 'id'])
    for id in movie_id:
        path=fetch_poster(id)
        movie_path.append(path)
    return result,movie_path

def radamon_movies():
    movie_id = []
    movie_path = []
    random_movie = random.sample(list(movies_cleaned_df['original_title']), 12)
    for movie in random_movie:
        movie_index = movies_cleaned_df[movies_cleaned_df['original_title'] == movie].index[0]
        movie_id.append(movies_cleaned_df.loc[movie_index, 'id'])
    for id in movie_id:
        path=fetch_poster(id)
        movie_path.append(path)
    return random_movie, movie_path





