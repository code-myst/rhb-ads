# RHB Ads Integration Guide

<!-- শুধু ব্যানার (কিছু না দিলেও এটাই হবে) -->
<script async src="https://code-myst.github.io/rhb-ads/rhb-ads.js" data-partner="sulaiman"></script>

<!-- ব্যানার + পপ-আপ -->
<script async src="https://code-myst.github.io/rhb-ads/rhb-ads.js" data-partner="sulaiman" data-slots="banner,popup"></script>

<!-- তিনটাই -->
<script async src="https://code-myst.github.io/rhb-ads/rhb-ads.js" data-partner="sulaiman" data-slots="banner,card,popup"></script>

## কয়েকটা জরুরি কথা

* **কার্ড চাইলে:** পেজে যেখানে কার্ড দেখাতে চান, সেখানে আলাদা করে `<div id="rhb-card"></div>` লিখতে হবে, আর `data-slots`-এ `card` রাখতে হবে[cite: 1]।
* **ব্যানার:** আলাদা কিছু লাগবে না। পেজের একেবারে উপরে নিজে থেকে বসে যাবে। চাইলে নিজের পছন্দের জায়গায় `<div id="rhb-banner"></div>` দিয়েও বসাতে পারেন[cite: 1]।
* **একাধিক পেজ থাকলে:** যে পেজে বিজ্ঞাপন চান, শুধু সেই ফাইলে লাইনটা দিন। সব পেজে চাইলে প্রতিটাতেই দিতে হবে। সাইটে যদি সবার জন্য এক ফুটার ফাইল থাকে, ওখানে একবার দিলেই হবে[cite: 1]।
* **পপ-আপ:** `data-slots`-এ `popup` লিখলেই আসবে, আলাদা কোনো জায়গা লাগবে না[cite: 1]।
* **হোস্ট:** `YOUR-HOST` অংশে আপনার GitHub Pages-এর পুরো ঠিকানা বসবে (আগে যেটা বলেছিলাম)[cite: 1]।
