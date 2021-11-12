const router = require("express").Router();
const Author = require("../models/Author.model");
const Book = require("../models/Book.model")


router.get("/", (req, res, next) => {
  res.render("index");
});



router.get("/lista-de-libros", (req, res, next) => {

  Book.find()
    .populate("author")
    .then(allTheBooks => res.render("book-list", { allTheBooks }))
    .catch(err => console.log(err))

});


//Los dos puntos indican que se debe recoger esa parte de la URL como un param
router.get("/detalles/:id", (req, res, next) => {

  //Se puede acceder a los params mediante req.params
  // const idParam = req.params.id
  const { id } = req.params

  Book.findById(id)
    .populate("author")
    .then(book => {

      console.log(book)

      res.render("book-details", book)
    })
    .catch(err => console.log(err))

});



////////////////////// CREACIÓN DE LIBROS /////////////////////////
//1. Crear la vista del formulario

router.get("/nuevo-libro", (req, res) => {
  res.render("new-book")
})

//4. Crear el endpoint para crear libros.

router.post("/nuevo-libro", (req, res) => {
  const { title, author, description, rating } = req.body;

  //5. Realizar las operaciones en la BBDD o la lógica de negocio
  Book.create({ title, author, description, rating })
    //6. Decidir que vista vamos a renderizar
    .then(book => res.render("book-details", book))
    .catch(err => console.log(err))

})

////////////////////// EDICIÓN DE LIBROS /////////////////////////

//1. Crear el endpoint que renderize el formulario.
//Añadir también el ID para tener disponible la info del libro en el form
//el enlace a este endpoint se encontrará en book-details.hbs
router.get("/editar-libro/:book_id", (req, res) => {

  const id = req.params.book_id

  Book.findById(id)
    .then(book => res.render("book-edit", book))
    .catch(err => console.log(err))
})


//3. Creamos el endpoint de editar-libro/id
router.post("/editar-libro/:book_id", (req, res) => {

  //4. Recogemos los datos del req.body y del req.params
  const { title, author, description, rating } = req.body;
  const { book_id } = req.params

  //5. Actualizamos el libro con findByIdAndUpdate. Ponemos new: true para que devuelva el nuevo.
  Book.findByIdAndUpdate(book_id, { title, author, description, rating }, { new: true })
    //6. Renderizamos de nuevo detalles pero con el libro actualizado
    .then(updatedBook => res.render("book-details", updatedBook))
    .catch(err => console.log(err))
})


////////////////////// CREACIÓN DE AUTORES /////////////////////////

router.get("/nuevo-autor", (req, res) => {

  Book.find()
    .then(allBooks => {
      res.render("new-author", { allBooks })
    })
    .catch(err => console.log(err))

})

router.post("/nuevo-autor", (req, res) => {
  const { name, lastName, nationality, birthday, pictureUrl, bookId } = req.body;



  Author.create({ name, lastName, nationality, birthday, pictureUrl })
    .then(author => {
      //Para añadir el autor al modelo de book
      Book.findByIdAndUpdate(bookId, { $push: { author: author._id } }, { new: true })
        .populate("author")
        .then(book => {
          res.render("book-details", book)
        })
        .catch(err => console.log(err))


    })
    .catch(err => console.log(err))
})


////////////////////// CREACIÓN DE REVIEWS /////////////////////////

router.get("/nueva-review/:book_id", (req, res) => {

  Book.findById(req.params.book_id)
    .then(book => res.render("new-review", book))
    .catch(err => console.log(err))
})

router.post("/nueva-review/:book_id", (req, res) => {

  const { user, comments } = req.body

  Book.findByIdAndUpdate(req.params.book_id,
    {
      $push: {
        reviews: { user, comments }
      }
    })
    .then(() => res.redirect("/"))
    .catch(err => console.log(err))
})



module.exports = router;
