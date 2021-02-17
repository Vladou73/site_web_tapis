const app = {
    // set first index for carousel slides
    slideIndex : 2,
    // set first index for catalogue slides
    articleIndex : 1
  }
  
  //script initialization
  app.init =  async function() {
    console.log('script is initiated');
  
    //get carpet data from JSON => needed to load images
    await app.loadJsonData();
    // Process json data & template elements to add img elements to DOM
    app.createCarouselSlides();
    app.createCatalogueSlides();
  
    // Get next/previous controls for carousel
    app.btn_prev_carousel = document.getElementById("catalogue__sect2__carousel__prev"),
    app.btn_next_carousel = document.getElementById("catalogue__sect2__carousel__next"),
  
    //initialize eventListeners
    app.eventListenersInitialization();
    //make sure to start on right slide index of the carousel
    app.switchCarouselSlides(app.slideIndex);
  
  }
  //Calls carpet data in json file
  app.loadJsonData = async function(){
    try {
      const catalogue = await fetch('../data/catalogue.json');
      const catalogueMin = await fetch('../data/catalogue_min.json');
      if (catalogue.status !== 200 || catalogueMin.status !== 200) {
        let res1 = await catalogue.json();
        let res2 = await catalogueMin.json();
        throw {res1, res2};
      } else {
        app.dataCatalogue = await catalogue.json();
        app.dataCatalogueMin = await catalogueMin.json();
      }
    } catch(error) {
      alert('impossible de charger les images');
      console.error(error);
    }
  }
  //use template tag, images & json data to create html elements for the carousel
  app.createCarouselSlides = function() {
    const dataCarousel = app.dataCatalogue.filter(elem => elem.section === 'situ');
    
    //reorder carpets in the order wanted
    dataCarousel.sort((a,b)=>{
      if (a.order < b.order) {
        return -1;
      } else {return 1};
    })
    //iterate over carpet datas to fetch images & create DOM elements
    dataCarousel.forEach((elem, index) => {
      app.addCarouselSlideToDom(elem);
      app.addCarouselModalSlideToDom(elem);
      app.addCarouselModalDotToDom(index);  
    });
  }
  //use template tag, images & json data to create html elements for the catalogue
  app.createCatalogueSlides = function() {
    const data = app.dataCatalogue.filter(elem => elem.section === "cat");
    
    data.sort((a,b)=>{
      if (a.order < b.order) {
        return -1;
      } else {return 1};
    })
 
    for (let elem of data) {
      app.addCatalogueArticleToDom(elem);
    //   app.addCatalogueModalSlideToDom(elem);
    }
  }
  
  app.addCatalogueArticleToDom = function(elem) {
    //create a clone of the template
    const newCataloguelArticle = document.importNode(document.getElementById('template__catalogue-article').content, true);
    // const newImg = newCataloguelArticle.querySelector('img');
    const newArticle = newCataloguelArticle.querySelector('a');
    const newImg = newCataloguelArticle.querySelector('img');
    
  
    //set image attributes with json data
    //fetch photos and min photos paths
    newImg.setAttribute('src', "../images/catalogue_min/" + elem.ref + '_' + elem.section + '_min.jpg');
    newArticle.setAttribute('href', "../images/catalogue_full_width/" + elem.file_name);
    newImg.setAttribute('alt',elem.title);
  
    //insert newImg in DOM
    const parent = document.querySelector('.catalogue__sect3__articles');
    parent.appendChild(newArticle);
  }
  
  app.addCarouselSlideToDom = function(elem) {
    //create a clone of the template
    const newCarouselSlide = document.importNode(document.getElementById('template__carrousel-slide').content, true);
    const newImg = newCarouselSlide.querySelector('img');
  
    //set image attributes with json data
    newImg.setAttribute('src', "../assets/" + elem.file_name);
    newImg.setAttribute('alt',elem.title);
  
    //insert newImg in DOM
    const parent = document.querySelector('.catalogue__sect2__carousel__images');
    const nextElem = document.querySelector('#catalogue__sect2__carousel__next');
    parent.insertBefore(newImg, nextElem);
  }
  
  app.addCatalogueModalSlideToDom = function(elem) {
    //create a clone of the template
    const newModalSlide = document.importNode(document.getElementById('template__modal-slide').content, true);
    const newSlide = newModalSlide.querySelector('figure');
    //set class attribute
    newSlide.classList.add('catalogue__sect3__modal__slide')
    //set image attributes with json data
    const newImg = newSlide.querySelector('img');
    newImg.setAttribute('src', "../assets/catalogue/" + elem.file_name);
    newImg.setAttribute('alt', elem.title);
  
    //set title and footer infos
    newSlide.querySelector('h3').innerHTML = elem.title;
    newSlide.querySelector('figcaption').innerHTML = `
      <p>Dimensions : ${elem.width} x ${elem.length}</p>
      <p>Origine : ${elem.origin}</p>
      <p>Durée de fabrication : ${elem.manufacturing_duration} ${(elem.manufacturing_duration>1)? "ans" : "an"}</p>`
  
      //insert newSlide in DOM
    const parent = document.querySelector('#catalogue__sect3__modal .slideshow-container');
    const nextElem = document.querySelector('#catalogue__sect3__modal__prev');
    parent.insertBefore(newSlide, nextElem);
  }
  
  app.addCarouselModalSlideToDom = function(elem) {
    //create a clone of the template
    const newModalSlide = document.importNode(document.getElementById('template__modal-slide').content, true);
    const newSlide = newModalSlide.querySelector('figure');
    //set class attribute
    newSlide.classList.add('catalogue__sect2__modal__slide')
    //set image attributes with json data
    const newImg = newSlide.querySelector('img');
    newImg.setAttribute('src', "../assets/" + elem.file_name);
    newImg.setAttribute('alt', elem.title);
  
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
  
  app.addCarouselModalDotToDom = function(index){
    //create a clone of the template
    const templateCopy = document.importNode(document.getElementById('template__modal-dot').content, true);
    const newDot = templateCopy.querySelector('span');
    //Set attribute to dot
    newDot.setAttribute('onclick', `app.currentSlide(${index+1})`);
    //insert newDot in DOM
    document.querySelector('.catalogue__sect2__modal__dots').appendChild(newDot);
  }
  
  //put all eventListeners on catalogue page elements
  app.eventListenersInitialization = function() {
    // MODALS
    const modals = document.getElementsByClassName("catalogue__modal")
  console.log(modals)
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
    const modalsContent = document.getElementsByClassName("catalogue__modal__content")
    window.addEventListener("click", (event)=>{
      for (let modal of modals) { 
        for (let modalContent of modalsContent) {
          if (event.target === modalContent) {
            modal.style.display = "none";
          }
        }
      }
    })
  
    // SLIDESHOW within the biggest modal (modal from catalogue section 2) 
    // When the user clicks on the prev/next buttons, changes slide
      // Get next/previous controls & add eventListeners
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
    // btn_prev_catalogue.addEventListener('click',() => {
    //   app.showSlidesCatalogueModal(app.articleIndex -= 1, "catalogue__sect3__modal__slide","catalogue__sect3__modal__slide-number");
    // })
    // btn_next_catalogue.addEventListener('click',() => {
    //   app.showSlidesCatalogueModal(app.articleIndex += 1, "catalogue__sect3__modal__slide","catalogue__sect3__modal__slide-number");
    // })
  
    //catalogue articles
    // const articles = document.getElementsByClassName("catalogue__sect3__article");
    // Array.from(articles).forEach((article, index)=>{
    //   article.addEventListener("click", ()=>{
    //     app.showSlidesCatalogueModal(index+1, "catalogue__sect3__modal__slide","catalogue__sect3__modal__slide-number")
    //   })
    // })
   
    // When the user clicks on the prev/next buttons of carousel, changes slide
    app.btn_prev_carousel.addEventListener('click',() => {
      app.switchCarouselSlides(app.slideIndex -= 1);
    })
    app.btn_next_carousel.addEventListener('click',() => {
      app.switchCarouselSlides(app.slideIndex += 1);
    })
  }
  // Thumbnail dots/image controls of the modal
  app.currentSlide = function(n) {
    app.showSlidesCarouselModal(app.slideIndex = n);
  }
  // function used for the modal within the carousel
  app.showSlidesCarouselModal = function(n) {
    //Cas où on click sur une image du catalogue : on veut que slideIndex corresponde à l'index de l'image
    if (event.target.className === 'catalogue__sect2__carousel__slide catalogue__sect2__carousel__image--main') {
      app.slideIndex = n;
    }
    const modal = document.getElementById("catalogue__sect2__modal");
    modal.style.display = "block";
  
    const slides = document.getElementsByClassName("catalogue__sect2__modal__slide");
    const dots = document.getElementsByClassName("catalogue__sect2__modal__dot");
    const slideNumber = document.getElementById("catalogue__sect2__modal__slide-number")
  
    //gestion des cas où on est en dessous de la limite de la 1ere image ou au delà de la dernière image
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
    
    // calls the function to switch slides of the carousel as it is in the modal
    app.switchCarouselSlides(app.slideIndex);
  }
  //function used for the modal within the catalogue
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
  // function used for the carousel of images in situ (big image, small images transparent, swith images...)
  app.switchCarouselSlides = (n) => {
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
    // 3) Change n° of slide Number
    console.log(document.querySelector('.catalogue__sect2__carousel__slide-number'))
    document.querySelector('.catalogue__sect2__carousel__slide-number').textContent = `${app.slideIndex}/${slides.length}`
  }
  
  document.addEventListener('DOMContentLoaded', app.init);