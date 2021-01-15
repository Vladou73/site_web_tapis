const app = {
  slideIndex : 2,
  articleIndex : 1
}

app.init =  async function() {
  console.log('script is initiated');

  //get carpet data from JSON => needed to load images
  await app.loadJsonData();
  // Process json data & template elements to add img elements to DOM
  app.createCarouselSlides();

  // Get next/previous controls
  app.btn_prev_carousel = document.getElementById("catalogue__sect2__carousel__prev"),
  app.btn_next_carousel = document.getElementById("catalogue__sect2__carousel__next"),

  app.eventListenersInitialization();
  app.switchSlides(app.slideIndex);
}

app.eventListenersInitialization = function() {
  // MODALS
  const modals = document.getElementsByClassName("catalogue__modal")

  // Get modals elements  : modal div, opening button & closing buttons 
  const closeBtns = document.getElementsByClassName("catalogue__modal__close");
  for (let closing of closeBtns) {
    // When the user clicks on (x), close the modal
    closing.addEventListener("click",()=>{
      for (let modal of modals) {
        modal.style.display = "none";
      }
    })
  }

  // When the user clicks anywhere outside of a modal, close it
  window.addEventListener("click", (event)=>{
    for (let modal of modals) { 
      if (event.target === modal) {
        modal.style.display = "none";
      }
    }
  })

  // SLIDESHOW within the biggest modal (modal from catalogue section 2) 
  // When the user clicks on the prev/next buttons, changes slide
    // Get next/previous controls
  const btn_prev_modal = document.getElementById("catalogue__sect2__modal__prev")
  const btn_next_modal = document.getElementById("catalogue__sect2__modal__next")
  const btn_prev_catalogue = document.getElementById("catalogue__sect3__modal__prev")
  const btn_next_catalogue = document.getElementById("catalogue__sect3__modal__next")

  btn_prev_modal.addEventListener('click',() => {
    app.showSlidesCarouselModal(app.slideIndex -= 1);
  })
  btn_next_modal.addEventListener('click',() => {
    app.showSlidesCarouselModal(app.slideIndex += 1);
  })
  btn_prev_catalogue.addEventListener('click',() => {
    app.showSlidesCatalogueModal(app.articleIndex -= 1, "catalogue__sect3__modal__slide","catalogue__sect3__modal__slide-number");
  })
  btn_next_catalogue.addEventListener('click',() => {
    app.showSlidesCatalogueModal(app.articleIndex += 1, "catalogue__sect3__modal__slide","catalogue__sect3__modal__slide-number");
  })

  //catalogue articles
  const articles = document.getElementsByClassName("catalogue__sect3__article");
  Array.from(articles).forEach((article, index)=>{
    article.addEventListener("click", ()=>{
      app.showSlidesCatalogueModal(index+1, "catalogue__sect3__modal__slide","catalogue__sect3__modal__slide-number")
    })
  })
 
  // When the user clicks on the prev/next buttons of carousel, changes slide
  app.btn_prev_carousel.addEventListener('click',() => {
    app.switchSlides(app.slideIndex -= 1);
  })
  app.btn_next_carousel.addEventListener('click',() => {
    app.switchSlides(app.slideIndex += 1);
  })
}

// Thumbnail dots/image controls of the modal
app.currentSlide = function(n) {
  app.showSlidesCarouselModal(app.slideIndex = n);
}

// function used for the modal within the carousel
app.showSlidesCarouselModal = function(n) {
    //Cas où on click sur un article : on veut que articleIndex corresponde à l'index de l'article
  if (event.target.className === 'catalogue__sect2__carousel__slide catalogue__sect2__carousel__image--main') {
    app.slideIndex = n;
  }
  const modal = document.getElementById("catalogue__sect2__modal");
  modal.style.display = "block";

  const slides = document.getElementsByClassName("catalogue__sect2__modal__slide");
  const dots = document.getElementsByClassName("catalogue__sect2__modal__dot");
  const slideNumber = document.getElementById("catalogue__sect2__modal__slide-number")

  if (n > slides.length) {app.slideIndex = 1}
  if (n < 1) {app.slideIndex = slides.length}
  
  let i;
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }

  slideNumber.textContent = `${app.slideIndex}/${slides.length}`
  slides[app.slideIndex-1].style.display = "block";
  dots[app.slideIndex-1].className += " active";
  
  app.switchSlides(app.slideIndex);
}

app.showSlidesCatalogueModal = function(n, classNameSlides, idSlideNumber) {
  //Cas où on click sur un article : on veut que articleIndex corresponde à l'index de l'article
  if (event.target.className === 'catalogue__sect3__article') {
    app.articleIndex = n;
  }

  const slides = document.getElementsByClassName(classNameSlides);
  const slideNumber = document.getElementById(idSlideNumber)
  const modalArticles = document.getElementById("catalogue__sect3__modal");

  if (n > slides.length) {app.articleIndex = 1}
  if (n < 1) {app.articleIndex = slides.length}
  
  let i;
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }

  slideNumber.textContent = `${app.articleIndex}/${slides.length}`
  slides[app.articleIndex-1].style.display = "block";
  modalArticles.style.display = "block"
  
}

// function used for the carousel of images in situ
app.switchSlides = (n) => {
  const slides = document.getElementsByClassName("catalogue__sect2__carousel__slide");
  const modal = document.getElementById("catalogue__sect2__modal");
  let slideIndexPrev, slideIndexNext;

  // 1) checks that slideIndex cannot get over/under number of slides. displays arrow buttons on behalf of this
  if (n > slides.length) {app.slideIndex = 1;}
  if (n < 1) {app.slideIndex = slides.length}

  if (app.slideIndex === 1) {
    slideIndexPrev = slides.length;
    slideIndexNext = 2;
    app.btn_prev_carousel.style.display = "none";
    app.btn_next_carousel.style.display = "block";
  } else if (app.slideIndex === slides.length) {
    slideIndexPrev = app.slideIndex - 1;
    slideIndexNext = 1;
    app.btn_prev_carousel.style.display = "block";
    app.btn_next_carousel.style.display = "none";
  } else {
    slideIndexPrev = app.slideIndex - 1;
    slideIndexNext = app.slideIndex + 1;
    app.btn_prev_carousel.style.display = "block";
    app.btn_next_carousel.style.display = "block";
  }

  // 2) Process main image, small image, and images that mustn't be displayed
  Array.from(slides).forEach((slide, index)=>{
    slide.style.display = "none";
    slide.classList.replace('catalogue__sect2__carousel__image--main','catalogue__sect2__carousel__image--small');
    slide.addEventListener('click', ()=>{modal.style.display = "none"});
    
    if (index ===  app.slideIndex-1) {
      slide.style.display = 'block';
      slide.classList.replace('catalogue__sect2__carousel__image--small','catalogue__sect2__carousel__image--main');
      slide.addEventListener("click", ()=>{
        app.showSlidesCarouselModal(index+1)
      })
    } else if (index === slideIndexPrev-1 || index === slideIndexNext-1) {
      slide.style.display = "block";
    }
  })
}

app.loadJsonData = async function(){
  try {
    const response = await fetch('../data/catalogue.json');

    if (response.status !== 200) {
      let error = await response.json();
      throw error;
    } else {
      app.dataCatalogue = await response.json();
    }
  } catch(error) {
    alert('impossible de charger les images');
    console.error(error);
  }
}

app.createCarouselSlides = function() {
  const dataCarousel = app.dataCatalogue.filter(elem => elem.section === 2);
  
  dataCarousel.sort((a,b)=>{
    if (a.order < b.order) {
      return -1;
    } else {return 1};
  })
  for (let elem of dataCarousel) {
    app.addCarouselSlideToDom(elem);
    app.addCarouselModalSlideToDom(elem);
  }
}

app.addCarouselSlideToDom = function(elem) {
  //create a clone of the template
  const newCarouselSlide = document.importNode(document.getElementById('template__carrousel-slide').content, true);
  const newImg = newCarouselSlide.querySelector('img');

  //set image attributes with json data
  newImg.setAttribute('src', "../assets/" + elem.file_name);
  newImg.setAttribute('alt', "../assets/" + elem.title);

  //insert newImg in DOM
  const parent = document.querySelector('.catalogue__sect2__carousel__images');
  const nextElem = document.querySelector('#catalogue__sect2__carousel__next');
  parent.insertBefore(newImg, nextElem);
}

app.addCarouselModalSlideToDom = function(elem) {
  //create a clone of the template
  const newModalSlide = document.importNode(document.getElementById('template__carrousel-slide__modal').content, true);
  const newSlide = newModalSlide.querySelector('.catalogue__sect2__modal__slide');

  //set image attributes with json data
  const newImg = newSlide.querySelector('img');
  newImg.setAttribute('src', "../assets/" + elem.file_name);
  newImg.setAttribute('alt', "../assets/" + elem.title);

  //set title and footer infos
  newSlide.querySelector('h3').innerHTML = elem.title;
  newSlide.querySelector('figcaption').innerHTML = `
    <p>Dimensions : ${elem.width} x ${elem.length}</p>
    <p>Origine : ${elem.origin}</p>
    <p>Durée de fabrication : ${elem.manufacturing_duration} ${(elem.manufacturing_duration>1)? "ans" : "an"}</p>`

    //insert newSlide in DOM
  const parent = document.querySelector('#catalogue__sect2__modal .slideshow-container');
  const nextElem = document.querySelector('#catalogue__sect2__modal__prev');
  parent.insertBefore(newSlide, nextElem);
}


document.addEventListener('DOMContentLoaded', app.init);