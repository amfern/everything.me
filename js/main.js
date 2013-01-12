// prevent resize and scroll for touch devices
document.ontouchmove = function(e) {
  e.preventDefault()
};

// disable drag scrolling
this.$('body').on('scroll', function(e) {
  e.preventDefault()
});

$(document).ready(function() {
  // load data
  if(!localStorage.articles) {
    $.getJSON('task/data/data.json', function(data) {
      window.articles = data.items;
      localStorage.setItem('articles', JSON.stringify(data.items));
      renderArticles();
    });
  } else {
    window.articles = JSON.parse(localStorage.getItem('articles')); 
    renderArticles();
  }
  
  // swiper 
  new Swiper('.article-body').on('swiper:swipe', function(e, originEvent, direction) {
    var closed = $('.article-body').hasClass('closed');
    if((closed && direction > 0) || (!closed && direction < 0))
      return;
      
    toggleArticleBody();
  });
  
  // menu button click
  $('.article-body .menu-btn').click(function() {
    toggleArticleBody();
  }); // notice .click() doesnt work, maybe zepto bug
  
  // article click
  new Scroller('.articles').on('scroll:click', function(e, originEvent) {
    if(originEvent.target.tagName != 'LI')
      return;
    
    var id = $(originEvent.target)
      .toggleClass('selected', true) // mark the articles as selected      
      .data('id'); // get id
      
      setArticleBody(id);
  });  
});

function setArticleBody(id) {
    var article = $('.article-body')
    
    toggleArticleBody(false); 
      
    article.find('.content').html(window.articles[id].content) // fill the article body with content
    article.find('.title').html(window.articles[id].title); // fill in the title  
}
 
function toggleArticleBody() {
  var args = ['closed'].concat([].splice.call(arguments, 0)),
      el = $('.article-body');
  return el.toggleClass.apply(el, args);
}

// renders all the articles 
function renderArticles() {
  var articlesEl = $('.articles');
  $.each(window.articles, function(i, article) {
    articlesEl
      .append($('<li>' + article.title + '</li>').data('id', i))
  });
}