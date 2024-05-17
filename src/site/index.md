---
title: Roll your own lazy loading
layout: default
---

Take a look at [the code on GitHub]({{ pkg.repository.url }}), or read on, for more explanation and examples.

These images have been added to the page in various sizes, using the picture element with multiple image sources.
This is a testing blog right now. Unsplash credit will be fixed soon.
{% set somePhotos = [
  {url: "danny-greenberg-F6mBll2j-pk-unsplash.jpg", credit: "NA", creditURL: "NA"},
  {url: "Easter-candy-eggs.jpg", credit: "NA", creditURL: "NA"},
  {url: "jack-white-t1uQIBwGWKA-unsplash.jpg", credit: "NA", creditURL: "NA"},
  {url: "joanna-stolowicz-8BES7-Ljtco-unsplash.jpg", credit: "", creditURL: "NA"},
  {url: "khaled-ali-2P-E1dNbvaU-unsplash.jpg", credit: "NA", creditURL: "NA"},
  {url: "vieste_italy.jpg", credit: "NA", creditURL: "NA"}
] %}

<section class="post-teaser">
{%- for photo in somePhotos %}
  <div class="credit">By <a href="{{ photo.creditURL }}" target="_BLANK" rel="noopener"> {{ photo.credit }}</a>, (<a href="/images/original/{{ photo.url }}" target="_BLANK" rel="noopener">Original</a>)</div>
  {% lazypicture photo.url, "Some Unsplash Pics" %}
{%- endfor -%}
</section >



## Image transformation

Thanks to the [Netlify Image CDN](https://docs.netlify.com/image-cdn/overview/?utm_source=github&utm_medium=icdn-example-pnh&utm_campaign=devex), we can take advantage of the ability to perform on-the-fly [image transformations](https://docs.netlify.com/image-cdn/overview/?utm_source=github&utm_medium=icdn-example-pnh&utm_campaign=devex#transform-images) to deliver resized and cropped, versions of the images, in the best format for the user's browser, directly from Netlify's optimised [edge infrastructure](https://www.netlify.com/features/adn/?utm_source=github&utm_medium=icdn-example-pnh&utm_campaign=devex).

Netlify Image CDN transforms and caches image assets if you make requests via a special `/.netlify/images/` URL, and add querystring parameters.

For example, the image below can be served in any size:

- [/.netlify/images/?url=/images/lighthouse-5.jpg?&w=20](/.netlify/images/?url=/images/lighthouse-5.jpg&w=20)
- [/.netlify/images/?url=/images/lighthouse-5.jpg&w=500](/.netlify/images/?url=/images/lighthouse-5.jpg&w=500)
- [/.netlify/images/?url=/images/lighthouse-5.jpg&w=700](/.netlify/images/?url=/images/lighthouse-5.jpg&w=700)

## Abstract with helper URLs

To clean these URLs up a little, we can use [Netlify's Redirects API](https://www.netlify.com/docs/redirects/?utm_source=github&utm_medium=icdn-example-pnh&utm_campaign=devex) to create some more friendly and abstracted URLs which [proxy]({{ pkg.repository.url }}/blob/master/netlify.toml) to the querystring decorated URLs:

- [/images/tiny/lighthouse-5.jpg](/images/tiny/lighthouse-5.jpg) → [/.netlify/images/?url=/images/lighthouse-5.jpg&w=20](/.netlify/images/?url=/images/lighthouse-5.jpg&w=20) 
- [/images/small/lighthouse-5.jpg](/images/small/lighthouse-5.jpg) → [/.netlify/images/?url=/images/lighthouse-5.jpg&w=500](/.netlify/images/?url=/images/lighthouse-5.jpg&w=500) 
- [/images/original/lighthouse-5.jpg](/images/original/lighthouse-5.jpg) → [/images/lighthouse-5.jpg](/images/lighthouse-5.jpg)

The [redirects]({{ pkg.repository.url }}/blob/master/netlify.toml) and transformations even work locally to ease your development efforts if you run your local build with [Netlify Dev](https://netlify.com/products/dev?utm_source=github&utm_medium=icdn-example-pnh&utm_campaign=devex)

## Using the picture element



## A picture helper

Whatever tool you use to generate your HTML, chances are that it includes a facility to make shortcodes or macros.

This example uses a static site generator called [11ty](https://www.11ty.io) which gives us the ability to make a [shortcode](https://www.11ty.io/docs/shortcodes/) to output picture tags with many image source attributes including  transformation parameters automatically added to the image urls.

This shortcode:

```html
{%- raw -%}
{% lazypicture lighthouse.jpg "A snazzy lighthouse" %}
{% endraw %}
```

outputs this html:

```html
<picture class="lazy lazy-initial">
  <source srcset="/images/tiny/lighthouse.jpg" media="(min-width: 1200px)">
  <source srcset="/images/tiny/lighthouse.jpg" media="(min-width: 740px)">
  <img src="/images/tiny/lighthouse.jpg" alt="A snazzy lighthouse" />
</picture>
```

This sets _each image source_ to use a tiny (typically less that 1k) version of the image. With some CSS, we size the image to fit and add some blurring to smooth it all down nicely.

Then, thanks to the magic of the browser's [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API). We can detect when our images come into the viewport, and [use JavaScript to update our image sources]({{ pkg.repository.url }}/blob/master/src/js/lazy.js) to use more appropriately sized images in our responsive picture element.

Removing the CSS class which applies the blur once our new image source is loaded completes the effect.

## Get started with Netlify Image CDN

Need some reference code to get you going? You can clone [the code for this site]({{ pkg.repository.url }}) to use as an example.

Once cloned, you can run the build locally or push to Netlify and start getting the benefits of the Netlify Image CDN right away.
