import { getDB } from "../common/db.js";
import { ObjectId } from "mongodb";

const peliculaCollection = "pelicula";

async function handleInsertPeliculaRequest(req, res) {
  const { nombre, generos, anioEstreno } = req.body;
  const nuevaPelicula = { nombre, generos, anioEstreno };

  getDB()
    .collection(peliculaCollection)
    .insertOne(nuevaPelicula)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      res.status(500).json({ mensaje: "Error al insertar la película", error });
    });
}

async function handleGetPeliculasRequest(req, res) {
  getDB()
    .collection(peliculaCollection)
    .find({})
    .toArray()
    .then((peliculas) => {
      res.status(200).json(peliculas);
    })
    .catch((error) => {
      res.status(500).json({ mensaje: "Error al obtener las películas", error });
    });
}

async function handleGetPeliculaByIdRequest(req, res) {
  try {
    const id = new ObjectId(req.params.id);

    getDB()
      .collection(peliculaCollection)
      .findOne({ _id: id })
      .then((pelicula) => {
        if (!pelicula) {
          return res.status(404).json({ mensaje: "Película no encontrada" });
        }
        res.status(200).json(pelicula);
      })
      .catch((error) => {
        res.status(500).json({ mensaje: "Error al obtener la película", error });
      });
  } catch (error) {
    res.status(400).json({ mensaje: "Id mal formado" });
  }
}

async function handleUpdatePeliculaByIdRequest(req, res) {
  try {
    const id = new ObjectId(req.params.id);
    const { nombre, generos, anioEstreno } = req.body;

    getDB()
      .collection(peliculaCollection)
      .updateOne({ _id: id }, { $set: { nombre, generos, anioEstreno } })
      .then((result) => {
        if (result.matchedCount === 0) {
          return res.status(404).json({ mensaje: "Película no encontrada" });
        }
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(500).json({ mensaje: "Error al actualizar la película", error });
      });
  } catch (error) {
    res.status(400).json({ mensaje: "Id mal formado" });
  }
}

async function handleDeletePeliculaByIdRequest(req, res) {
  try {
    const id = new ObjectId(req.params.id);

    getDB()
      .collection(peliculaCollection)
      .deleteOne({ _id: id })
      .then((result) => {
        if (result.deletedCount === 0) {
          return res.status(404).json({ mensaje: "Película no encontrada" });
        }
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(500).json({ mensaje: "Error al eliminar la película", error });
      });
  } catch (error) {
    res.status(400).json({ mensaje: "Id mal formado" });
  }
}

export {
  handleInsertPeliculaRequest,
  handleGetPeliculasRequest,
  handleGetPeliculaByIdRequest,
  handleUpdatePeliculaByIdRequest,
  handleDeletePeliculaByIdRequest,
};