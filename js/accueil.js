const accueil = {
    init :  function() {
        console.log('script is initiated on page accueil');
        // allow transitions on body ONLY AFTER html is loaded
        accueil.allowTransitions();
        // use IntersectionObserver to planify text showing animation 
        accueil.setTextAnimationTriggers();
    },
    allowTransitions: function(){
        document.querySelector('.preload').classList.remove('preload');
    },
    setTextAnimationTriggers : function() {
        
        // animation to set on the text block of every section. 
        const options = {
            root:null,
            rootMargin: '0px',
            threshold: 0.01
        }
        // separate odd and even sections, with text block which moves right or left
        const oddObserver = new IntersectionObserver(accueil.animateMoveLeft, options);
        const evenObserver = new IntersectionObserver(accueil.animateMoveRight, options);
        const oddSections = document.querySelectorAll('.home-section__1, .home-section__3, .home-section__5');
        const evenSections = document.querySelectorAll('.home-section__2, .home-section__4');
        for (let section of oddSections) {
            oddObserver.observe(section);
        }
        for (let section of evenSections) {
            evenObserver.observe(section);
        }
    },
    animateMoveRight : function(entries){
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelector('.home-section__text').classList.add('home-section__text__move-right');
            }
        });
    },
    animateMoveLeft : function(entries){
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelector('.home-section__text').classList.add('home-section__text__move-left');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', accueil.init);