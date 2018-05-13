var express     = require("express"),
methodOverride  = require("method-override"),
expressSanitize = require("express-sanitizer"),
mongoose        = require("mongoose"),
bodyParser      = require("body-parser"),
app             = express();

// APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.use(methodOverride("_method"));
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitize());

// MONGOOSE /MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

/* Blog.create({
    title: "Test Blog",
    image: "https://images.pexels.com/photos/14104/pexels-photo-14104.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    body:"Hello, this is a BLOG POST!"
}) */

// RESTFUL ROUTES
app.get("/", function(req, res){
    res.redirect("/blogs");
})

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err) console.log(err);
        else res.render("index", {blogs:blogs});
    });
});

app.get("/blogs/new", function(req, res){
    res.render("new");
});

app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, blog){
        if(err) res.render("new");
        else res.redirect("/blogs");
    });
});

app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, blog){
        if(err) res.redirect("/blogs");
        else res.render("show", {blog: blog});
    });
});

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, blog){
        if(err) res.redirect("/blogs");
        else res.render("edit", {blog: blog});
    });
});

app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err) res.redirect("/blogs");
        else res.redirect("/blogs/" + req.params.id);
    });
});

app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err, updatedBlog){
        if(err) res.redirect("/blogs");
        else res.redirect("/blogs");
    });
});

// 
app.listen(3000, function(){
    console.log("BlogREST HAS STARTED");
});