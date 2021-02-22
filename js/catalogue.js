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

    //call lightbox options
    lightbox.option({
      'albumLabel':"Image %1 sur %2",
      'wrapAround': true,
      'alwaysShowNavOnTouchDevices':true
    })

    // Process json data & template elements to add img elements to DOM
    app.createCarouselSlides();
    app.createCatalogueSlides();
  
    // Get next/previous controls for carousel
    app.btn_prev_carousel = document.getElementById("catalogue__sect2__carousel__prev")
    app.btn_next_carousel = document.getElementById("catalogue__sect2__carousel__next")
  
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
      console.log(catalogue);
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
    const dataCarousel = app.dataCatalogue.filter(elem => elem.section === 'cat');
    dataCarousel.filter(elem => elem.situ >= 1);
    //reorder carpets in the order wanted
    dataCarousel.sort((a,b)=>{
      if (a.order < b.order) {
        return -1;
      } else {return 1};
    })
    //iterate over carpet datas to fetch images & create DOM elements
    dataCarousel.forEach((elem, index) => {
      app.addCarouselSlideToDom(elem);
      // app.addCarouselModalSlideToDom(elem);
      // app.addCarouselModalDotToDom(index);  
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
  
    app.addDetailsToModalImg(elem, newArticle);

    //insert newImg in DOM
    const parent = document.querySelector('.catalogue__sect3__articles');
    parent.appendChild(newArticle);
  }
  
  app.addDetailsToModalImg = function(elem, article) {
    articleDetails = `
      <p>${elem.title}</p>
      <p>Dimensions : ${elem.width} x ${elem.length}</p>
      <p>Durée de fabrication : ${elem.manufacturing_duration} ${(elem.manufacturing_duration>1)? "ans" : "an"}</p>`
    article.setAttribute('data-title', articleDetails)
  }

  app.addCarouselSlideToDom = function(elem) {
    for (let i=1; i<=elem.situ; i++) {
      //create a clone of the template
      const newCarouselSlide = document.importNode(document.getElementById('template__carrousel-slide').content, true);
      const newSlide = newCarouselSlide.querySelector('a');
      const newImg = newCarouselSlide.querySelector('img');

      //set image attributes with json data
      //fetch photos and min photos paths
      newImg.setAttribute('src', "../images/catalogue_min/" + elem.ref + '_situ_' + i + '_min.jpg');
      newSlide.setAttribute('href', "../images/catalogue_full_width/" + elem.ref + '_situ_' + i + '.jpg');
      newImg.setAttribute('alt',elem.title);
    
      app.addDetailsToModalImg(elem, newSlide);

      //insert newImg in DOM
      const parent = document.querySelector('.catalogue__sect2__carousel__images');
      const nextElem = document.querySelector('#catalogue__sect2__carousel__next');
      parent.insertBefore(newSlide, nextElem);

    }

  }
  
  //put all eventListeners on catalogue page elements
  app.eventListenersInitialization = function() {
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

  // function used for the carousel of images in situ (big image, small images transparent, swith images...)
  app.switchCarouselSlides = (n) => {
    const slides = document.getElementsByClassName("catalogue__sect2__carousel__slide");
    let slideIndexPrev, slideIndexNext;
  
    // 1) checks that slideIndex cannot get over/under number of slides. displays arrow buttons on behalf of this
    if (n > slides.length) {app.slideIndex = 1;}
    if (n < 1) {app.slideIndex = slides.length}
  
    if (app.slideIndex === 1) {
      slideIndexPrev = slides.length;
      slideIndexNext = 2;
    } else if (app.slideIndex === slides.length) {
      slideIndexPrev = app.slideIndex - 1;
      slideIndexNext = 1;
    } else {
      slideIndexPrev = app.slideIndex - 1;
      slideIndexNext = app.slideIndex + 1;
    }
  
    // 2) Process main image, small image, and images that mustn't be displayed
    Array.from(slides).forEach((slide, index)=>{
      slide.style.display = "none";
      slide.classList.replace('catalogue__sect2__carousel__image--main','catalogue__sect2__carousel__image--small');

      if (index ===  app.slideIndex-1) {
        slide.style.display = 'block';
        slide.classList.replace('catalogue__sect2__carousel__image--small','catalogue__sect2__carousel__image--main');
        
      } else if (index === slideIndexPrev-1 || index === slideIndexNext-1) {
        slide.style.display = "block";
      }
    })
    // 3) Change n° of slide Number
    document.querySelector('.catalogue__sect2__carousel__slide-number').textContent = `${app.slideIndex}/${slides.length}`
  }
  
  document.addEventListener('DOMContentLoaded', app.init);