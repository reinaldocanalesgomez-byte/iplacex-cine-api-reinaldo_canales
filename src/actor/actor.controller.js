import { getDB } from "../common/db.js";
import { ObjectId } from "mongodb";

const actorCollection = "actor";
const peliculaCollection = "pelicula";

async function handleInsertActorRequest(req, res) {
  const { idPelicula, nombre, edad, estaRetirado, premios } = req.body;

  try {
    const peliculaId = new ObjectId(idPelicula);

    getDB()
      .collection(peliculaCollection)
      .findOne({ _id: peliculaId })
      .then((pelicula) => {
        if (!pelicula) {
          return res.status(404).json({ mensaje: "La película indicada no existe" });
        }

        const nuevoActor = { idPelicula, nombre, edad, estaRetirado, premios };

        getDB()
          .collection(actorCollection)
          .insertOne(nuevoActor)
          .then((result) => {
            res.status(201).json(result);
          })
          .catch((error) => {
            res.status(500).json({ mensaje: "Error al insertar el actor", error });
          });
      })
      .catch((error) => {
        res.status(500).json({ mensaje: "Error al validar la película", error });
      });
  } catch (error) {
    res.status(400).json({ mensaje: "Id de película mal formado" });
  }
}

async function handleGetActoresRequest(req, res) {
  getDB()
    .collection(actorCollection)
    .find({})
    .toArray()
    .then((actores) => {
      res.status(200).json(actores);
    })
    .catch((error) => {
      res.status(500).json({ mensaje: "Error al obtener los actores", error });
    });
}

async function handleGetActorByIdRequest(req, res) {
  try {
    const id = new ObjectId(req.params.id);

    getDB()
      .collection(actorCollection)
      .findOne({ _id: id })
      .then((actor) => {
        if (!actor) {
          return res.status(404).json({ mensaje: "Actor no encontrado" });
        }
        res.status(200).json(actor);
      })
      .catch((error) => {
        res.status(500).json({ mensaje: "Error al obtener el actor", error });
      });
  } catch (error) {
    res.status(400).json({ mensaje: "Id mal formado" });
  }
}

async function handleGetActoresByPeliculaIdRequest(req, res) {
  const { idPelicula } = req.params;

  getDB()
    .collection(actorCollection)
    .find({ idPelicula: idPelicula })
    .toArray()
    .then((actores) => {
      res.status(200).json(actores);
    })
    .catch((error) => {
      res.status(500).json({ mensaje: "Error al obtener los actores de la película", error });
    });
}

export {
  handleInsertActorRequest,
  handleGetActoresRequest,
  handleGetActorByIdRequest,
  handleGetActoresByPeliculaIdRequest,
};