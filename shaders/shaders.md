## Shaders

Here are some shaders I've made. Hover over any of the below to view them. 

The source code for each is available from this website's repository and my shadertoy, where these shaders can also be viewed in higher resolution and framerates.

<script>

document.getElementById("main_content").style.minHeight="0px";
const wrap = document.getElementById("main_content_wrap");
const div = document.createElement('div');
div.id = "shader_container";
wrap.appendChild(div);

var styles = `
#shader_container{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 20px;
}
`

var styleSheet = document.createElement("style")
styleSheet.textContent = styles
document.head.appendChild(styleSheet)


function addCanvasElements(n) {
  for (let i = 1; i <= n; i++) {
    const canvas = document.createElement('canvas');
    canvas.id = `shaderCanvas${i}`;
    canvas.width = 500;
    canvas.height = 300;
    canvas.margin = 10;
    div.appendChild(canvas);
  }
}

// Usage
addCanvasElements(6);
</script>


<script src="jader.js"></script>
<script src="portfolio.js"></script>
