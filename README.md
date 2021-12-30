# YouTube Dislikes Extension

# ** DEPRECATED - HISTORICAL PRESERVATION **

### How does it work?

This is a content script that uses some builtin JS methods to calculate the dislikes on a YouTube video. It does so by extracting both the **average rating** and **like count** of the video and using a weighted average calculation to compute an estimate of the dislike count.

Thanks to [ReturnYoutubeDislikes](https://github.com/Anarios/return-youtube-dislike "Repo") for inspiration on this method.

The extrapolation of this data is ineffcient but the calculation method provides a reasonable estimate for the dislike count.

### Why is this deprecated?

This script uses an ```XMLHttpRequest``` to get the average rating, which is no longer provided within a YouTube video's source code.

