// SCRIPT JS DE DETECTION D'ADDBLOCK. (testé sur Firefox 01/2014)
// Fiche de style de #s660 <STYLE> déclaré dans css/SSblock.css
// Et <DIV id="s660"></DIV> Déclaration necessaire juste avant le script.
// Envois des données addblock à php/verify.php : qui modifie $_SESSION['addblock'] : Fonction send();
// Et enfin, réinitialisation de $_SESSION['addblock'] dans php/logique.php.

// document.write("script ADB actif.");
function send()
{
	var xhr = getXMLHttpRequest();
	xhr.open("GET", "php/verify.php?addblock=1", true);
	xhr.send(null);
}
function getXMLHttpRequest()
{
	var xhr = null;

	if (window.XMLHttpRequest || window.ActiveXObject)
	{
		if (window.ActiveXObject)
		{
			try
		   {
				xhr = new ActiveXObject("Msxml2.XMLHTTP");
			}
			catch(e)
			{
				xhr = new ActiveXObject("Microsoft.XMLHTTP");
			}
		}
		else
		{
			xhr = new XMLHttpRequest();
		}
	}
	else
	{
		alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
		return null;
	}
	return xhr;
}
function add()
{
window.document.getElementById("s660").parentNode.removeChild(window.document.getElementById("s660"));
(function(l,m)
{
	function n(a)
	{
		a&&s660.nextFunction()
	}
	var h=l.document,p=["i","s","u"];
	n.prototype=
	{
		rand:function(a)
		{
			return Math.floor(Math.random()*a)
		}
		,getElementBy:function(a,b)
		{
			return a?h.getElementById(a):h.getElementsByTagName(b)
		}
		,getStyle:function(a)
		{
			var b=h.defaultView;
			return b&&b.getComputedStyle?b.getComputedStyle(a,null):a.currentStyle
		}
		,deferExecution:function(a)
		{
			setTimeout(a,250)
		}
		,insert:function(a,b)
		{
			var e=h.createElement("b"),d=h.body,c=d.childNodes.length,g=d.style,f=0,k=0;if("s660"==b)
			{
				e.setAttribute("id",b);
				g.margin=g.padding=0;g.height="100%";
				for(c=this.rand(c);f<c;f++)1==d.childNodes[f].nodeType&&(k=Math.max(k,parseFloat(this.getStyle(d.childNodes[f]).zIndex)||0));
				k&&(e.style.zIndex=k+1);c++
			}
			e.innerHTML=a;d.insertBefore(e,d.childNodes[c-1])
      }
		,displayMessage:function(a)
		{
			var b=this;
		   send();
			a="abisuq".charAt(b.rand(5));
			h.addEventListener&&b.deferExecution(function()
			{
				b.getElementBy("s660").addEventListener("DOMNodeRemoved",function()
				{
					b.displayMessage()
				}
				,!1)
			})
		}
		,i:function()
		{
			for(var a="adPosition9,ad_fg,ads_space,headadvert,middle_ad,nationalad,top_mpu,ad,ads,adsense".split(","),b=a.length,e="",d=this,c=0,g="abisuq".charAt(d.rand(5));
			c<b;c++)d.getElementBy(a[c])||(e+="<"+g+' id="'+a[c]+'"></'+g+">");
			d.insert(e);
			d.deferExecution(function()
			{
				for(c=0;c<b;c++)if(null==d.getElementBy(a[c]).offsetParent||"none"==d.getStyle(d.getElementBy(a[c])).display)return d.displayMessage("#"+a[c]+"("+c+")");
				d.nextFunction()
			})
		}
		,s:function()
		{
			var a=
			{
				'pagead2.googlesyndic':'google_ad_client','js.adscale.de/getads':'adscale_slot_id','get.mirando.de/miran':'adPlaceId'
			}
			,b=this,e=b.getElementBy(0,"script"),d=e.length-1,c,g,f,k;
			h.write=null;
			for(h.writeln=null;0<=d;--d)if(c=e[d].src.substr(7,20),a[c]!==m)
			{
				f=h.createElement("script");
				f.type="text/javascript";
				f.src=e[d].src;g=a[c];
				l[g]=m;
				f.onload=f.onreadystatechange=function()
				{
					k=this;
					l[g]!==m||k.readyState&&"loaded"!==k.readyState&&"complete"!==k.readyState||(l[g]=f.onload=f.onreadystatechange=null,e[0].parentNode.removeChild(f))
				};
				e[0].parentNode.insertBefore(f,e[0]);
				b.deferExecution(function()
				{
					if(l[g]===m)return b.displayMessage(f.src);
					b.nextFunction()
				}
				);
				return
			}
			b.nextFunction()
		}
		,u:function()
		{
			var a="/adflashes/ad,/admain.,/adtago.,/affilinet/ad,/freead2.,/headerads.,/housead/ad,/~cdn/ads/ad,_ad2.,/468x60_".split(","),b=this,e=b.getElementBy(0,"img"),d,c;e[0]!==m&&e[0].src!==m&&(d=new Image,d.onload=function()
			{
	 			c=this;
				c.onload=null;
				c.onerror=function()
				{
					p=null;b.displayMessage(c.src)
				};
				c.src=e[0].src+"#"+a.join("")
			}
			,d.src=e[0].src);
			b.deferExecution(function()
			{
				b.nextFunction()
			})
		}
		,nextFunction:function()
		{
			var a=p[0];
			a!==m&&(p.shift(),this[a]())
		}
	};
l.s660=s660=new n;h.addEventListener?l.addEventListener("load",n,!1):l.attachEvent("onload",n)
}
)(window);
}
add();
