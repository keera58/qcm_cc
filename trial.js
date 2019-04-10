var http = require('http');
var util = require('util');
var fs = require('fs');
var url = require('url');
var x="";
var y="";
var z="";
var server = http.createServer(function (req,res){                            
    var u = url.parse(req.url,true);   
    if(u.pathname == '/')
        fs.readFile('./try1.html',function(error,data)
        { 
		    res.end(data);    
	    });
    else if(u.pathname == '/getData')
    {
  		y=u.query.subject;
		z=u.query.faculty;
		if(u.query.tl==0)
			x="Theory";
		else if(u.query.tl==1)
			x="Lab";
		else
			x="Project";		
	 	fs.readFile('./index.html',function(error,data)
		{ 
	    	res.end(data);  
	    });
	}
	if(u.pathname == '/rating')
	{
    	var mongoclient=require('mongodb').MongoClient;
		var mongourl="mongodb+srv://keera_enn:M0lk!nda@keera-qcm-84dwl.mongodb.net/test?retryWrites=true";
		mongoclient.connect(mongourl,{useNewUrlParser:true},function(err,db)
		{
			if (err) throw err;
			var dbo=db.db("rating");
			var obj={subject:y, faculty:z, tl:x, one:parseFloat(u.query.one), two:parseFloat(u.query.two), three:parseFloat(u.query.three), four:parseFloat(u.query.four)};
		    //if (flag==0)
		    //{
			dbo.collection("qcm").insertOne(obj, function(err, res) 
			{
		     	if (err) throw err;
		   		console.log("1 document inserted");		
		    });
		    //}
			    
		});
		res.end("<h1>Thank you for your feedback!</h1>");	
	}
	if(u.pathname =='/view')
	{
		var mongoclient=require('mongodb').MongoClient;
		var mongourl="mongodb+srv://keera_enn:M0lk!nda@keera-qcm-84dwl.mongodb.net/test?retryWrites=true";
		mongoclient.connect(mongourl,{useNewUrlParser:true},function(err,db)
		{
			if (err) throw err;
			var dbo=db.db("rating");
			var p="";
			var h=[];
			var i=0;
			dbo.collection("qcm").aggregate([{$group:{_id:{subject:"$subject",faculty:"$faculty",tl:"$tl"},one:{$avg:"$one"},two:{$avg:"$two"},three:{$avg:"$three"},four:{$avg:"$four"}}}]).toArray(function(err, result)
			{
				p+="<table border=\"1\" cellpadding=\"15\" border= style=\"border:solid 1px #C3C3C3; padding:20px; spacing: 20px; cellfont-family:Arial\"><tr><td align=\"center\"><b> SUBJECT </b></td><td align=\"center\"><b> FACULTY </b></td><td align=\"center\"><b> THEORY/LAB/PROJECT </b></td><td align=\"center\"><b> RATING 1 </b></td><td align=\"center\"><b> RATING 2 </b></td><td align=\"center\"><b> RATING 3 </b></td><td align=\"center\"><b> RATING 4 </b></td></tr><tr></tr>";
			    for(var i=0;i<result.length;i++)
			    {
			    	var m=result[i];
			    	p+="<tr></tr><tr><td>"+m._id.subject+"</td><td>"+m._id.faculty+"</td><td>"+m._id.tl+"</td><td>"+m.one+"</td><td>"+m.two+"</td><td>"+m.three+"</td><td>"+m.four+"</td></tr>";
			    }
			    res.end(p);
		    });		
		});		
	}		 
});
server.listen(3000);
console.log('Server listenning at http://ec2-54-70-94-134.us-west-2.compute.amazonaws.com:3000'); 

/*
var a=0,b=0,c=0,d=0;
			var flag=0;
dbo.collection("qcm").find({}).toArray(function(err, result)
			{
			    for(var i=0;i<result.length;i++)
			    {
			    	var m=result[i];	
			    	if (m.subject==y && m.faculty==z && m.tl==x) 
			    	{
			    		flag=1;
			    		console.log("old flag");
			    		console.log(flag);
			    		a=(m.one+parseFloat(u.query.one))/2;
			    		b=(m.two+parseFloat(u.query.two))/2;
			    		c=(m.three+parseFloat(u.query.three))/2;
			    		d=(m.four+parseFloat(u.query.four))/2;
			    		var id=m._id;
    					var obj={subject:y, faculty:z, tl:x, one:a, two:b, three:c, four:d};
    					dbo.collection("qcm").updateOne({ _id: id}, { $set: obj }, function(err, res) 
    					{
    						if (err) throw err;
						    console.log("1 document updated");
						    db.close();
						});
						break;
			    	}
			    }
		    });	

*/
