function getDislikeCount(httpRequest) {
	var reqText = httpRequest.responseText;
	if (!reqText) {
		throw "XMLHttpRequest is null";
	}

	/* 
	average rating method inspired by ReturnYoutubeDislike
	https://github.com/Anarios/return-youtube-dislike
	*/

	// get the rating of the video
	var ratingIndex = reqText.indexOf("averageRating") + 15;
	var averageRating = "";
	var i = ratingIndex;
	while (reqText.at(i) != ",") {
		averageRating += reqText.at(i);
		i++;
	}

	averageRating = parseFloat(averageRating);
	console.log("average rating: " + averageRating);

	// get the like count of the video
	var likesIndex = reqText.indexOf(" likes");
	var likesStr = "";
	i = likesIndex;
	while (reqText.at(i) != "\"") {
		if (reqText.at(i) == ",") {
			i--;
			continue;
		}
		likesStr += reqText.at(i);
		i--;
	}
	console.log("likesStr: " + likesStr);

	// reverse likesString since we got it backwards originally
	var likes = "";
	for (i = likesStr.length - 1; i >= 0; i--) {
		likes += likesStr.at(i);
	}
	likes = parseFloat(likes);
	console.log("likes: " + likes);

	/* each like has a weight of 5 while dislikes have a weight of 1 in the calculation for average rating
	- example: a video with 1 like and 1 dislike has an average rating of 3 = () / 2
	*/
	var dislikes = Math.floor((likes * (5 - averageRating)) / (averageRating - 1));
	return dislikes;
}

function simpleTextify(num) {
	var retStr = "";
	var numStr = num.toString();
	if (num < 1000) {
		return numStr;
	} else if (num < 10000) {
		if (numStr.at(1) != "0") {
			retStr = numStr.at(0) + "." + numStr.at(1) + "k";
		} else {
			retStr = numStr.at(0) + "k";
		}
	} else if (num < 100000) {
		retStr = numStr.substring(0, 2) + "k";
	} else if (num < 1000000) {
		retStr = numStr.substring(0, 3) + "k";
	} else if (num < 10000000) {
		if (numStr.at(1) != "0") {
			retStr = numStr.at(0) + "." + numStr.at(1) + "m";
		} else {
			retStr = numStr.at(0) + "m";
		}
	} else if (num < 100000000) {
		retStr = numStr.substring(0, 2) + "m";
	}

	return retStr;
}

window.addEventListener('yt-navigate-finish', function() {
	// function to update the dislikes using the likes container
	function updateDislikes(dislikeCount) {
		// find and load content into dislikes element
		var simpleDislike = simpleTextify(dislikeCount);
		var btnContainer = (document.querySelector('[aria-label="Dislike this video"]').parentElement).parentElement;
		var dislikeBtn = (btnContainer.children)[1];
		dislikeBtn.innerHTML = '';
		dislikeBtn.append(simpleDislike);
		console.log("updated dislikes to: " + simpleDislike);
	}

	// get video data with XMLHttp request
	let videoURL = window.location.href;
	// leave function if we're on the main youtube page
	if (videoURL == "https://www.youtube.com/") {
		return;
	}
	var dislikes = 0;
	var req = new XMLHttpRequest();
	req.open("GET", videoURL);

	// get the dislike count and make a trimmed string based on the number of dislikes
	req.onload =  function() {
		try {
			dislikes = getDislikeCount(req);
			updateDislikes(dislikes);
		} catch (e) {
			console.error(e);
		}
	}; 
	req.send();
});