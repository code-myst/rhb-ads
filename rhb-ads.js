/* RHB Ads – ক্লায়েন্টের সাইটে শুধু এই লাইন বসাবেন (যেকোনো জায়গায়, </body>-এর আগে ভালো):
   <script async src="https://YOUR-HOST/rhb-ads.js" data-partner="PARTNER-ID"></script>
   data-partner = ওই সাইটের মালিকের আইডি (পরে ভিউ/আয়ের হিসাবে কাজে লাগবে)
   data-slots   = কোথায় দেখাবে: banner, card, popup (কমা দিয়ে একাধিক)। না দিলে শুধু banner।
     উদাহরণ: data-slots="banner,popup"   |   card-এর জন্য পেজে <div id="rhb-card"></div> লাগবে 
   ঐচ্ছিক: <div id="rhb-banner"></div> বা <div id="rhb-card"></div> দিলে সেখানেই দেখাবে। */
(function () {
  if (window.__rhbAds) return;
  window.__rhbAds = true;

  // async স্ক্রিপ্টে currentScript শুরুতেই ধরে রাখতে হয়
  var me = document.currentScript;
  var PARTNER = (me && me.getAttribute("data-partner")) || "";
  var SLOTS = ((me && me.getAttribute("data-slots")) || "banner")
    .toLowerCase().split(",").map(function (x) { return x.trim(); });
  function want(n) { return SLOTS.indexOf(n) !== -1; }

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  var PID = "codemyst-web-templates";
  var KEY = "AIzaSyCvyOUQnhbI-k0WyLJOKvr-DlaV4rvl5jo";
  var COLLECTION = "rhb_ads"; // এই কালেকশনেই অ্যাডমিন প্যানেল বিজ্ঞাপন রাখে
  var URL = "https://firestore.googleapis.com/v1/projects/" + PID +
            "/databases/(default)/documents/" + COLLECTION + "?pageSize=50&key=" + KEY;

  var css = ".rhb-ad{position:relative;display:flex;gap:12px;align-items:center;text-decoration:none;color:#1d2a1f;background:#fff;border:1px dashed #2f6b3a;border-radius:12px;padding:10px;overflow:hidden;font-family:system-ui,sans-serif;line-height:1.4;box-sizing:border-box}" +
    ".rhb-ad *{box-sizing:border-box}" +
    ".rhb-ad .rhb-img{width:72px;height:72px;border-radius:10px;flex:none;object-fit:cover;background:#e8f1e3;display:flex;align-items:center;justify-content:center;font-size:30px}" +
    ".rhb-ad b{display:block;font-size:15px}.rhb-ad span{color:#5b6b5e;font-size:13px}" +
    ".rhb-ad em{position:absolute;top:4px;right:8px;font-style:normal;font-size:10px;color:#5b6b5e}" +
    ".rhb-card{flex-direction:column;align-items:flex-start}.rhb-card .rhb-img{width:100%;height:110px}" +
    "#rhb-top{max-width:960px;margin:8px auto;padding:0 12px}" +
    "#rhb-pop{position:fixed;right:12px;bottom:12px;width:min(290px,calc(100% - 24px));z-index:2147483000;box-shadow:0 6px 22px rgba(0,0,0,.25);border-radius:12px}" +
    "#rhb-pop .rhb-x{position:absolute;top:-10px;left:-10px;width:26px;height:26px;border-radius:50%;border:0;background:#1d2a1f;color:#fff;cursor:pointer;z-index:2;font-size:15px;line-height:1}";

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  function build(ad, extra) {
    var a = el("a", "rhb-ad " + (extra || ""));
    a.href = /^https?:\/\//i.test(ad.link) ? ad.link : "#";
    a.target = "_blank";
    a.rel = "noopener sponsored";
    if (PARTNER) a.setAttribute("data-partner", PARTNER);
    var img;
    if (ad.imageUrl && /^https?:\/\//i.test(ad.imageUrl)) {
      img = el("img", "rhb-img"); img.src = ad.imageUrl; img.alt = "";
    } else { img = el("div", "rhb-img", "📣"); }
    var box = el("div");
    box.appendChild(el("b", "", ad.title));
    box.appendChild(el("span", "", ad.desc));
    a.appendChild(img); a.appendChild(box);
    a.appendChild(el("em", "", "বিজ্ঞাপন · RHB Ads"));
    return a;
  }

  function parse(doc) {
    var f = doc.fields || {};
    function s(k) { return f[k] && f[k].stringValue ? f[k].stringValue : ""; }
    return { title: s("title"), desc: s("desc"), link: s("link"), imageUrl: s("imageUrl"),
             active: f.active ? f.active.booleanValue !== false : true };
  }

  function show(ads) {
    if (!ads.length) return;
    var style = el("style"); style.textContent = css; document.head.appendChild(style);
    var start = Math.floor(Math.random() * ads.length);
    function pick(i) { return ads[(start + i) % ads.length]; }

    if (want("banner")) {
      var banner = document.getElementById("rhb-banner");
      if (!banner) {
        banner = el("div"); banner.id = "rhb-top";
        document.body.insertBefore(banner, document.body.firstChild);
      }
      banner.appendChild(build(pick(0)));
    }

    if (want("card")) {
      var card = document.getElementById("rhb-card");
      if (card) card.appendChild(build(pick(1), "rhb-card"));
    }

    if (want("popup")) {
      var pop = el("div"); pop.id = "rhb-pop";
      var x = el("button", "rhb-x", "×"); x.setAttribute("aria-label", "বন্ধ করুন");
      x.onclick = function () { pop.remove(); };
      pop.appendChild(x); pop.appendChild(build(pick(2)));
      document.body.appendChild(pop);
    }
  }

  fetch(URL)
    .then(function (r) { return r.json(); })
    .then(function (j) {
      var ads = (j.documents || []).map(parse).filter(function (a) { return a.active && a.title; });
      ready(function () { show(ads); });
    })
    .catch(function () { /* বিজ্ঞাপন না এলে ক্লায়েন্টের সাইট ঠিকই চলবে */ });
})();
