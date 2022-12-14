





<!DOCTYPE html>






<html>
<head>
	<meta charset="utf-8">
	<title>MP3 &mdash; Audiocogs</title>
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

	<link rel="stylesheet" type="text/css" href="/css/all.min.css">
	<link rel="shortcut icon" href="/favicon.ico">
	<!--[if lt IE 9]>
	<script src="/scripts/html5shiv.js"></script>
	<![endif]-->

	<link rel="alternate" type="application/rss+xml" title="Audiocogs Blog" href="/rss.xml">
</head>
<body class="codec">
<section>
	<header class="main">
		<div class="inner">
		<h1>
			<div id="name">
				<a href="/">Audiocogs</a>
			</div>
			<div id="social">
				<a href="http://twitter.com/audiocogs"><img id="twitterbird" class="twitter" width="30" height="30" src="/images/white-twitter.png" alt="Audiocogs on twitter."></a>
				<a href="https://github.com/audiocogs"><img id="white-octocat" class="github" width="30" height="30" src="/images/white-octocat.png" alt="Audiocogs on github."></a>
			</div>
		</h1>
		</div>
	</header>
	<section id="content">
		<div class="title-nav">
			<ul>

        <li><a href="/codecs">Codecs</a></li>

        <li><a href="/codecs/mp3">MP3</a></li>
        <li><a href="/codecs/alac">ALAC</a></li>
        <li><a href="/codecs/flac">FLAC</a></li>
        <li><a href="/codecs/aac">AAC</a></li>

			</ul>
		</div>

		<article>
			<header>

				<h1 id="article_title">MP3</h1>


			</header>


<link rel="stylesheet" href="/dgplayer/player.css" />

<script src="/dgplayer/resources/classlist.js"></script>
<script>
var unsupported;
if (!window.Audio || !('mozWriteAudio' in new Audio()) && !window.AudioContext && !window.webkitAudioContext) {
    unsupported = true;
    document.body.classList.add("unsupported");
}
</script>
<div id="unsupported">
We're really sorry about this, but it looks like your browser doesn't support an Audio API. Please
try these demos in Chrome 15+ or Firefox 8+ or watch a <a href="http://vimeo.com/33919455">screencast</a>.
</div>


<p><a href="https://github.com/audiocogs/jsmad">JSMad</a> was the first proof that JavaScript audio decoding is possible and is a port of libmad, a C based MPEG audio decoder. MP3 is probably the most common audio format out there. It is designed for small file sizes but compromises on quality.</p>

<script src="/dgplayer/player.js"></script>
<script src="/codecs/js/auroraplayer.js"></script>

<div class="player" id="dgplayer" tabindex="0">
    <div class="avatar">
        <img src="/dgplayer/resources/fallback_album_art.png">
    </div>

    <span class="title">Unknown Title</span>
    <span class="artist">Unknown Artist</span>

    <div class="button"></div>

    <div class="volume">
        <img src="/dgplayer/resources/volume_high.png">
        <div class="track">
            <div class="progress"></div>
            <div class="handle"></div>
        </div>
        <img src="/dgplayer/resources/volume_low.png">
    </div>

    <div class="seek">
        <span>0:00</span>
        <div class="track">
            <div class="loaded"></div>
            <div class="progress"></div>
        </div>
        <span>-0:00</span>
    </div>

    <div class="file_button"></div>
    <span class="file_description">Choose an MP3 file on your computer</span>
</div>

<script src="/codecs/js/aurora.js"></script>
<script src="/codecs/js/mp3.js"></script>

<script type="text/javascript">
// Chrome doesn't support changing the sample rate, and uses whatever the hardware supports.
// We cheat here.  Instead of resampling on the fly, we're currently just loading two different
// files based on common hardware sample rates.
var _sampleRate = (function() {
    var AudioContext = (window.AudioContext || window.webkitAudioContext);
    if (!AudioContext)
        return 44100;

    return new AudioContext().sampleRate;
}());

(function(DGPlayer){
    if (unsupported) return;

    DGPlayer.volume = 100;

    var player, onplay;
    var url = '';

    DGPlayer.on('play', onplay = function(){
        if (player)
            player.disconnect();

        player = new DGAuroraPlayer(AV.Player.fromURL(url), DGPlayer);
        DGPlayer.off('play', onplay);
    });

    DGPlayer.on('file', function(file) {
        if (file) {
            if (player)
                player.disconnect();

            player = new DGAuroraPlayer(AV.Player.fromFile(file), DGPlayer);
            DGPlayer.off('play', onplay);
        }
    });

}(DGPlayer(document.getElementById('dgplayer'))));
</script>


		</article>

	</section>
</section>
</body>
</html>
