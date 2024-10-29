const mapDBToModelAlbums = ({
  id,
  name,
  year,
  coverUrl,
}) => ({
  id,
  name,
  year,
  coverUrl,
});

const mapDBToModelAllSongs = ({
  id,
  title,
  performer,
}) => ({
  id,
  title,
  performer,
});

const mapDBToModelAllPlaylists = ({
  id,
  name,
  owner: username,
}) => ({
  id,
  name,
  username,
});

const mapDBToModelSongs = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
});

module.exports = {
  mapDBToModelAlbums, mapDBToModelAllSongs, mapDBToModelSongs, mapDBToModelAllPlaylists,
};
