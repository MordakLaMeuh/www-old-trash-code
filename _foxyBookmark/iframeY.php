
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org   /TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<script src="http://code.jquery.com/jquery-1.2.3.min.js"></script>
<title>Cancellation Policy</title>
</head>
<body>

<span>Some text goes here.</span>
<br /><br />
<iframe src="http://www.w3schools.com/"></iframe>
<iframe src="https://www.google.co.in/?gws_rd=cr&ei=-bmBUo24M6npiAeepICYAg"></iframe>

<script>
        var url = 'https://www.google.co.in/?gws_rd=cr&ei=-bmBUo24M6npiAeepICYAg';
        $.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent(url) + '&callback=?', function(data){
            var html = ""+data.contents;

            /* Replace relative links to absolute ones */
            html = html.replace(new RegExp('(href|src)="/', 'g'),  '$1="'+url+'/');

            $("#siteLoader").html(html);
        });
    </script>
    <div id="siteLoader">
        <i>Loading&hellip;</i>
    </div>
</body>
</html>