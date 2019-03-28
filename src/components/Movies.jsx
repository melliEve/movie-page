import React, { Component } from 'react';
import MoviesTable from './MoviesTable';
import GenreList from './common/GenreList';
import Pagination from './common/pagination';
import { getMovies } from '../services/fakeMovieService';
import { getGenres } from '../services/fakeGenreService';
import { paginate } from '../utils/paginate';
import _ from 'lodash';


class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    currentPage: 1,
    pageSize: 4,
    sortColumn: { path: 'title', order: 'asc' },
  }

  componentDidMount() {
    const genres = [{ _id: '', name: 'All Genres' }, ...getGenres()]
    this.setState({ movies: getMovies(), genres });
  }

  handleDelete = movie => {
    const movies = this.state.movies.filter(m => m._id !== movie._id);
    this.setState({ movies: movies });
  };

  handleLike = movie => {
    const movies = [...this.state.movies]; //make a copy of array of objects
    const index = movies.indexOf(movie); //find index of that obj and store it a const
    movies[index] = { ...movies[index] }     //go to movies of index and asign the cloned obj
    movies[index].liked = !movies[index].liked;     //toggle the movies of index
    this.setState({ movies });
  };

  handlePageChange = page => {
    this.setState({ currentPage: page })
  }

  handleGenreSelect = (genre) => {
    this.setState({ selectedGenre: genre })
  }

  handleSort = path => {
    const sortColumn = { ...this.state.sortColumn };
    if (sortColumn.path === path)
      sortColumn.order = sortColumn.order === 'asc' ? 'desc' : 'asc';
    else {
      sortColumn.path = path;
      sortColumn.order = 'asc';
    }
    this.setState({ sortColumn });
  }
  render() {
    const { length: count } = this.state.movies;
    const { pageSize, currentPage, sortColumn, selectedGenre, movies: allMovies } = this.state;

    if (count === 0) return <p>There are no movies in the database.</p>

    const filtered = selectedGenre && selectedGenre._id
      ? allMovies.filter(m => m.genre._id === selectedGenre._id)
      : allMovies;

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order])

    const movies = paginate(sorted, currentPage, pageSize);

    return (
      <div className="row">
        <div className="col-3">
          <GenreList
            items={this.state.genres}
            selectedItem={this.state.selectedGenre}
            onItemSelect={this.handleGenreSelect} />
        </div>
        <div className="col">
          <p>Showing {filtered.length} movies in the database.</p>
          <MoviesTable
            movies={movies}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort} />

          <Pagination itemsCount={filtered.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange} />
        </div>
      </div>
    )
  }
}

export default Movies;