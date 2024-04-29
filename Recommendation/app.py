from flask import Flask, render_template, request,redirect, url_for,jsonify
from contentbased import recommendation,radamon_movies

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['POST','GET'])
def search():
    searchText = request.json['searchText']
    result,movie_path=recommendation(searchText)
    print(result)
    print(movie_path)
    return jsonify({'result': result, 'movie_path': movie_path})

@app.route('/movies')
def movies():
    return render_template('movies.html')

@app.route('/movie',methods=['GET'])
def movie():
    data = []
    result, movie_path = radamon_movies()
    print(result)
    print(movie_path)
    return jsonify({'result': result, 'movie_path': movie_path})

if __name__ == '__main__':
    app.run(debug=True)