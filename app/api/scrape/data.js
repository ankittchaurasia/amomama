const data = {
    distractify: {
        title: "Distractify",
        hasMultiplePage: true,
        url: "https://www.distractify.com/trending?page=",
        cardwrapper: ($)=>$('li article'),
        cardimage: ($, card) => {
            const img = $(card).find('img');
            return img.attr('data-mm-src') || img.attr('src');
        },
        cardtitle: ($, card)=>$(card).find('h2').text().trim(),
        cardlink: ($, card)=>$(card).parent('a').attr('href'),
    },
    snopes: {
        title: "Snopes",
        hasMultiplePage: true,
        url: "https://www.snopes.com/latest/?pagenum=",
        cardwrapper: ($)=>$('.article_wrapper'),
        cardimage: ($, card)=>$(card).find('.article_img').find('img').attr('data-src'),
        cardtitle: ($, card)=>$(card).find('h3').text().trim(),
        cardlink: ($, card)=>$(card).find('a').attr('href'),
    },
    boredpanda: {
        title: "Bored Panda",
        hasMultiplePage: true,
        url: "https://boredpanda.com/page/",
        cardwrapper: ($)=>$('article.post:not(.swiper-slide)'),
        cardimage: ($, card)=>$(card).find('img').attr('src'),
        cardtitle: ($, card)=>$(card).find('h2').text().trim(),
        cardlink: ($, card)=>$(card).find('a').attr('href'),
    },
    lolitopia: {
        title: "Lolitopia",
        hasMultiplePage: true,
        url: "https://lolitopia.com/category/health/page/",
        cardwrapper: ($)=>$('li.post-item'),
        cardimage: ($, card)=>$(card).find('img').attr('src'),
        cardtitle: ($, card)=>$(card).find('h3').text().trim(),
        cardlink: ($, card)=>$(card).find('a').attr('href'),
    },

    pakstne: {
        title: 'Pakstne',
        hasMultiplePage: true,
        url: 'https://pakstne.com/page/',
        cardwrapper: ($)=>$('.type-post'),
        cardimage: ($, card)=>$(card).find('img').attr('src')?.replace('-300x300', ''),
        cardtitle: ($, card)=>$(card).find('.entry-title a').text().trim(),
        cardlink: ($, card)=>$(card).find('.entry-title a').attr('href'),
    },
    usaunfiltered: {
        title: 'USA Unfiltered',
        hasMultiplePage: true,
        url: 'https://usaunfiltered24.com/page/',
        cardwrapper: ($)=>$('article.mg-posts-sec-post'),
        cardimage: ($, card)=>{
            const styleAttr = $(card).find('.back-img').attr('style');
            return styleAttr ? styleAttr.match(/url\(['"]?(.*?)['"]?\)/)[1] : null;
        },
        cardtitle: ($, card)=>$(card).find('.entry-title a').text().trim(),
        cardlink: ($, card)=>$(card).find('.entry-title a').attr('href'),
    },
    newzpost: {
        title: 'NewzPost',
        hasMultiplePage: true,
        url: 'https://thenewzpost.com/page/',
        cardwrapper: ($)=>$('.type-post'),
        cardimage: ($, card)=>$(card).find('img').attr('src')?.replace('-300x300', ''),
        cardtitle: ($, card)=>$(card).find('.entry-title a').text().trim(),
        cardlink: ($, card)=>$(card).find('.entry-title a').attr('href'),
    }
    
}

export default data;