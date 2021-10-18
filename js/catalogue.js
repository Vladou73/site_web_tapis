const app = {
    // set first index for carousel slides
    slideIndex : 2,
    currentPage : 1,
    itemsPerPage : 16
  }
  
  //script initialization
  app.init =  async function() {
    console.log('script is initiated');
  
    //get carpet data from JSON => needed to load images
    await app.loadJsonData();

    //get json data for catalogue slides 
    app.dataCatalogue = app.jsonData.filter(elem => elem.section === "cat");  

    //call lightbox options
    lightbox.option({
      'albumLabel':"Image %1 sur %2",
      'wrapAround': true,
      'alwaysShowNavOnTouchDevices':true
    })

    // Process json data & template elements to add img elements to DOM. Use pagination parameters for catalogue elements
    app.createCarouselSlides();
    app.createPaginatedCatalogueSlides();
    //setup pagination container
    app.setupPagination();


    // Get next/previous controls for carousel
    app.btn_prev_carousel = document.getElementById("catalogue__sect2__carousel__prev")
    app.btn_next_carousel = document.getElementById("catalogue__sect2__carousel__next")
  
    //initialize eventListeners
    app.eventListenersInitialization();
    //make sure to start on right slide index of the carousel
    app.switchCarouselSlides(app.slideIndex);

  
  }

  // Calls carpet data in json file with asynchronous jquery functions
  app.loadJsonData = async function(){
    await $.getJSON('./data/catalogue.json', function(data) {
      app.jsonData = data
    }).fail(function(){
      console.log('error occured for app.jsonData');
      // throw new Error
    });
  }
  
  //use template tag, images & json data to create html elements for the carousel
  app.createCarouselSlides = function() {
    const dataCarousel = app.dataCatalogue;
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
    });
  }
  //use template tag, images & json data to create html elements for the catalogue
  app.createPaginatedCatalogueSlides = function() {
    // (re)initialize parent html element to none 
    const parent = document.querySelector('.catalogue__sect3__articles');
    parent.innerHTML = '';

    // get pagination infos
    let start = app.itemsPerPage * (app.currentPage - 1);
    let end = start + app.itemsPerPage;
  
    app.dataCatalogue.sort((a,b)=>{
      if (a.order < b.order) {
        return -1;
      } else {return 1};
    })
 
    // apply pagination params to retrieve only items of current page
    let paginatedItems = app.dataCatalogue.slice(start, end);

    for (let elem of paginatedItems) {
      app.addCatalogueArticleToDom(elem, parent);
      app.addCatalogueHiddenArticlesToDom(elem, parent);
    //   app.addCatalogueModalSlideToDom(elem);
    }
  }
  
  app.addCatalogueArticleToDom = function(elem, parent) {
    //create a clone of the template
    const newCataloguelArticle = document.importNode(document.getElementById('template__catalogue-article').content, true);
    // const newImg = newCataloguelArticle.querySelector('img');
    const newArticle = newCataloguelArticle.querySelector('a');
    const newImg = newCataloguelArticle.querySelector('img');
    const newFigcaption = newCataloguelArticle.querySelector('figcaption');
  
    //set image attributes with json data
    //fetch photos and min photos paths
    newImg.setAttribute('src', "./images/catalogue_min/" + elem.ref + '_' + elem.section + '_min.jpg');
    newArticle.setAttribute('href', "./images/catalogue_full_width/" + elem.file_name);
    newArticle.setAttribute("data-lightbox", "catalogue_" + elem.ref);
    newImg.setAttribute('alt',elem.title);
  
    app.addDetailsToModalImg(elem, newArticle);
    app.addFigcaptionDetails(elem, newFigcaption);

    //insert newImg in DOM
    parent.appendChild(newArticle);
  }
  
  app.addDetailsToModalImg = function(elem, article) {
    let articleDetails = `
      <p>${elem.title}</p>
      <p>Dimensions : ${elem.width} x ${elem.length}</p>
      <p>Durée de fabrication : ${elem.manufacturing_duration} ${(elem.manufacturing_duration>1)? "ans" : "an"}</p>`
    article.setAttribute('data-title', articleDetails)
  }

  app.addFigcaptionDetails = function(elem, figcaption) {
    let figcaptionDetails = `
      <h3>${elem.title}</h3>
      <p>Dimensions : ${elem.width} x ${elem.length}</p>
      <p>Durée de fabrication : ${elem.manufacturing_duration} ${(elem.manufacturing_duration>1)? "ans" : "an"}</p>`
    figcaption.insertAdjacentHTML('afterbegin', figcaptionDetails);
  }

  app.addCarouselSlideToDom = function(elem) {
    for (let i=1; i<=elem.situ; i++) {
      //create a clone of the template
      const newCarouselSlide = document.importNode(document.getElementById('template__carrousel-slide').content, true);
      const newSlide = newCarouselSlide.querySelector('a');
      const newImg = newCarouselSlide.querySelector('img');

      //set image attributes with json data
      //fetch photos and min photos paths
      newImg.setAttribute('src', "./images/catalogue_min/" + elem.ref + '_situ_' + i + '_min.jpg');
      newSlide.setAttribute('href', "./images/catalogue_full_width/" + elem.ref + '_situ_' + i + '.jpg');
      newImg.setAttribute('alt',elem.title);
    
      app.addDetailsToModalImg(elem, newSlide);

      //insert newImg in DOM
      const parent = document.querySelector('.catalogue__sect2__carousel__images');
      const nextElem = document.querySelector('#catalogue__sect2__carousel__next');
      parent.insertBefore(newSlide, nextElem);
    }
  }
  
  app.addCatalogueHiddenArticlesToDom = function(elem, parent) {
    // for a future development, also add backward photos 
    for (let i=1; i<=elem.situ; i++) {
      //create a clone of the template
      const newCataloguelArticle = document.importNode(document.getElementById('template__catalogue-article').content, true);
      const newArticle = newCataloguelArticle.querySelector('a');
      const newImg = newCataloguelArticle.querySelector('img');

      //set image attributes with json data
      //fetch photos and min photos paths
      newImg.setAttribute('src', "./images/catalogue_min/" + elem.ref + '_situ_' + i + '_min.jpg');
      newArticle.setAttribute('href', "./images/catalogue_full_width/" + elem.ref + '_situ_' + i + '.jpg');
      newImg.setAttribute('alt',elem.title);
      //set same attribute data-lightbox than the visible catalogue article with its reference
      newArticle.setAttribute("data-lightbox", "catalogue_" + elem.ref)
      //hide the article. Only the img in the modal will be visible if scrolled
      newArticle.style.display = 'none';

      app.addDetailsToModalImg(elem, newArticle);

      //insert newImg in DOM
      parent.appendChild(newArticle);
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
  
  // function used for the carousel of images in situ (big image, small images transparent, swith images...)
  app.switchCarouselSlides = (n) => {
    // console.log('switchCarouselSlides', n)
    const slides = document.getElementsByClassName("catalogue__sect2__carousel__slide");
    let slideIndexPrev, slideIndexNext;
  
    // 1) checks that slideIndex cannot get over/under number of slides. displays arrow buttons on behalf of this
    if (n > slides.length) {app.slideIndex = 1;}
    if (n < 1) {app.slideIndex = slides.length}
  
    if (app.slideIndex === 1) {
      // slideIndexPrev = slides.length;
      slideIndexPrev = 2
      slideIndexNext = 3;
    } else if (app.slideIndex === slides.length) {
      slideIndexPrev = app.slideIndex - 1;
      slideIndexNext = app.slideIndex - 2;
      // slideIndexNext = 1;
    } else {
      slideIndexPrev = app.slideIndex - 1;
      slideIndexNext = app.slideIndex + 1;
    }
    console.log(window.innerWidth)
 

    // 2) Process main image, small image, and images that mustn't be displayed
    Array.from(slides).forEach((slide, index)=>{
      // all slides must not be shown
      slide.style.display = "none";
      slide.classList.replace('catalogue__sect2__carousel__image--main','catalogue__sect2__carousel__image--small');

      //show only current slide in big + prev and next slide in small
      //-1 is because with forEach loop index starts at 0
      if (index ===  app.slideIndex-1) {
        slide.style.display = 'block';
        slide.classList.replace('catalogue__sect2__carousel__image--small','catalogue__sect2__carousel__image--main');
        
      } else if ((window.innerWidth > 700) && (index === slideIndexPrev-1 || index === slideIndexNext-1)) { //only show small images on desktop
        slide.style.display = "block";
      }
    })
    // 3) Change n° of slide Number
    document.querySelector('.catalogue__sect2__carousel__slide-number').textContent = `${app.slideIndex}/${slides.length}`
  }
  
  app.setupPagination = function() {
    // store elements in variables
    const paginationContainer = document.querySelector('.pagination_container');
    const prevButton = document.getElementById('pagination_prev');
    const nextButton = document.getElementById('pagination_next');

    //setup pagination buttons
    let pageCount = Math.ceil(app.dataCatalogue.length / app.itemsPerPage);
    for (let i = 1; i < pageCount + 1; i++) {
      let btn = app.paginationButton(i);
      paginationContainer.insertBefore(btn, nextButton);
    }

    //setup eventlisteners for prev and next buttons
    prevButton.addEventListener('click',function(){
      if (app.currentPage>1){
        //set new current page
        app.currentPage--;
        //get new active page and modify pagination buttons class
        let activeButton = document.querySelector('.active_page').previousElementSibling;
        app.changeActivePageClass(activeButton);
        //load carpets
        app.createPaginatedCatalogueSlides();
      }
    });

    nextButton.addEventListener('click',function(){
      if (app.currentPage<pageCount){
        //set new current page
        app.currentPage++;
        //get new active page and modify pagination buttons class
        let activeButton = document.querySelector('.active_page').nextElementSibling;
        app.changeActivePageClass(activeButton);
        //load carpets
        app.createPaginatedCatalogueSlides();
      }
    });  

  }

  app.paginationButton = function(page) {
    //create button pagination element in DOM
    let button = document.createElement('li');
    button.innerText = page;
    button.classList.add('page_number');

    //for current page (when initialized, current page = 1) adds class pagination active to the button for CSS style
    if (app.currentPage == page) button.classList.add('active_page');
  
    //event listener added to each pagination button 
    button.addEventListener('click', function(e) {
      app.currentPage = page;
      //trigger function to show pictures of selected page
      app.createPaginatedCatalogueSlides();
      app.changeActivePageClass(e.currentTarget);
    });
  
    return button;
  }

  app.changeActivePageClass = function(button) {
    //remove active class from former active pagination button
    let formerActivePage = document.querySelector('.active_page');
    formerActivePage.classList.remove('active_page');
    button.classList.add('active_page');
  }
  

  document.addEventListener('DOMContentLoaded', app.init);