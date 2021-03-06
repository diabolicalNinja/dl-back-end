//Initials//
var express = require("express");
const cors =require('cors');
var app = express();
var app2 = express();
app.use(cors());
app2.use(cors());




//For the first screen//
var xlsx= require("xlsx");

var wb=xlsx.readFile("Data Lineage - Data Model.xlsx");

var ws1=wb.Sheets["DL_Entities_Attributes"];
var ws2=wb.Sheets["DL_Entities_Dependencies"];
var ws3=wb.Sheets["DL_Info_Context_Apps"];
var ws4=wb.Sheets["DL_Info_Context_Entities"];

a=[]
a.push(xlsx.utils.sheet_to_json(ws1))
a.push(xlsx.utils.sheet_to_json(ws4))
a.push(xlsx.utils.sheet_to_json(ws3))

app.get("/", (req, res, next) => {
    res.json(a);
   });



//For second screen(Entity Part)//
var arr=xlsx.utils.sheet_to_json(ws4)

app.get("/:username", (req, res, next) => {
var id = req.params.username;
var result=[];
//console.log(id);
arr.forEach(function (arrayItem) {
if(arrayItem.DH_Entity_Name===id){
        result.push(arrayItem.ID);
        result.push(arrayItem.Entity_Business_Name);
        result.push(arrayItem.Entity_SOR);
        result.push(arrayItem.Business_Context);
        result.push(arrayItem.Privacy_Classification);
        result.push(arrayItem.DH_Schema_Name);
        result.push(arrayItem.DH_Entity_Name);
        result.push(arrayItem.Data_Refresh_frequency);
        result.push(arrayItem.Integration_Type);
        result.push(arrayItem.Data_Transfer_Method);
        result.push(arrayItem.DV12N_Published_Path);
        result.push(arrayItem.APIGW_Published_Service_URL);
        result.push(arrayItem.Active_Status);
        result.push(arrayItem.Source_System_UI_Mapping);
        result.push(arrayItem.Source_System_Entity_Name);
        result.push(arrayItem.Comments);
        }
    });
    res.json(result);
   });





//For the second screen(Attribute Part)//
var ws5=wb.Sheets["DL_Info_Context_Attributes"];
var arr2=xlsx.utils.sheet_to_json(ws5);
var arr3=xlsx.utils.sheet_to_json(ws1);

app.get("/:id1/:id2", (req, res, next) => {

    var id1=req.params.id1;
    var id2=req.params.id2;
    var result2=[];

    arr3.forEach(function(arrayItem) {
        if(arrayItem.DH_Attribute_Name===id1){
            if(arrayItem.DH_Entity_Name===id2){
                result2.push(arrayItem.Data_Type);
                result2.push(arrayItem.Data_Length);
                result2.push(arrayItem.Data_Precision);
            }
        }
    });

    arr2.forEach(function(arrayItem) {
        if(arrayItem.DH_Attribute_Name===id1){
            if(arrayItem.DH_Entity_Name===id2){
                result2.push(arrayItem.ID);
                result2.push(arrayItem.Attribute_Business_Name);
                result2.push(arrayItem.Business_Context);
                result2.push(arrayItem.Privacy_Classification);
                result2.push(arrayItem.DH_Schema_Name);
                result2.push(arrayItem.DH_Entity_Name);
                result2.push(arrayItem.DH_Attribute_Name);
                result2.push(arrayItem.Attribute_Sample_Values);
                result2.push(arrayItem.DV12N_Published_Path);
                result2.push(arrayItem.APIGW_Published_Service_URL);
                result2.push(arrayItem.DV12N_Published_Attribute_Name);
                result2.push(arrayItem.APIGW_Published_Attribute_Name);
                result2.push(arrayItem.Active_Status);
                result2.push(arrayItem.Source_System_UI_Mapping);
                result2.push(arrayItem.Source_System_Attribute_Name);
                result2.push(arrayItem.Comments);
            }
        }
    });
    res.json(result2);
});

//For the second screen(Application Part)//

var arr4=xlsx.utils.sheet_to_json(ws3);

app.get("/:id1/:id2/:id3", (req, res, next) =>{
    var id=req.params.id1;
    result3=[];
    console.log(id);
    arr4.forEach(function (arrayItem) {
        if(arrayItem.Application_Name===id){
            //console.log(arrayItem.Application_Name);
            result3.push(arrayItem.Application_Name);
            result3.push(arrayItem.Application_Clarity_ID);
            result3.push(arrayItem.Business_Context);
            result3.push(arrayItem.Privacy_Classification);
            result3.push(arrayItem.Application_User_ID);
            result3.push(arrayItem.Data_Refresh_frequency);
            result3.push(arrayItem.Data_Transfer_Method);
            result3.push(arrayItem.Integration_Type);
            result3.push(arrayItem.Active_Status);
            result3.push(arrayItem.Comments);
        }
    });
    res.json(result3);
});

var server_port = process.env.OCP_PORT1 || 8001

var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

app.listen(server_port, server_ip_address, () => {
 console.log("Server 1 running on " + server_ip_address + ", port " + server_port);
});


var xlsx= require("xlsx");
var wb=xlsx.readFile("Data Lineage - Data Model.xlsx");

var ws1=wb.Sheets["DL_Info_Context_Entities"];
var ws2=wb.Sheets["DL_Entities_Dependencies"];
var ws3=wb.Sheets["DL_Entities_Attributes_Apps"];
var ws4=wb.Sheets["DL_Entities_Attributes"];
    
var arr1=xlsx.utils.sheet_to_json(ws1)
var arr2=xlsx.utils.sheet_to_json(ws2)
var arr3=xlsx.utils.sheet_to_json(ws3)
var arr4=xlsx.utils.sheet_to_json(ws4)

app2.get("/:entity", (req, res,next) => {

    var entity= req.params.entity;
    var root;
    var l2;
    arr1.forEach(function (arrayItem) {
        if(arrayItem.DH_Entity_Name===entity){
            if(arrayItem.DH_Schema_Name==="HORIZON_CDB"){
                root="HORIZON";
            }
            else{
                root="DARWIN";
            }
            l2=arrayItem.DH_Schema_Name+"."+arrayItem.DH_Entity_Name
        }
    })

    var refEntity={}
    var counter=1;
    var j;
    arr2.forEach(function (arrayItem) {
        if(arrayItem.DH_Entity_Name===entity){
            refEntity[counter]=arrayItem.Referenced_DH_Schema_Name+"."+arrayItem.Referenced_DH_Entity_Name;
            counter++;
        }
    })

    console.log(refEntity);

    data={}
    var i=0;
    arr3.forEach(function (arrayItem) {
        if(arrayItem.DH_Entity_Name===entity){
            data[i]=[arrayItem.Application_User_ID,arrayItem.Application_Name]
            i++;
        }
    })

    const num=i;
    
    var tree=[{name:root,children:[{}]}]

    if(Object.keys(refEntity).length != 0)
    {
        tree[0].children[0].name="REFERENCED SCHEMA.REFERENCED ENTITY"
        tree[0].children[0].attributes={}
        for(j=1;j<=counter;j++){
            tree[0].children[0].attributes[j]=refEntity[j]
        }
        tree[0].children[0].children=[{}]
        tree[0].children[0].children[0].name=l2
        tree[0].children[0].children[0].children=[]

        const len=i-1
        var i=0
        while(i<=len){
            tree[0].children[0].children[0].children[i]={}
            tree[0].children[0].children[0].children[i].name=data[i][0]
            tree[0].children[0].children[0].children[i].children=[{name:data[i][1]}]
            i++
        }
    }
    else{
        tree[0].children[0].name=l2
        tree[0].children[0].children=[]

        const len=i-1
        var i=0
        while(i<=len){
            tree[0].children[0].children[i]={}
            tree[0].children[0].children[i].name=data[i][0]
            tree[0].children[0].children[i].children=[{name:data[i][1]}]
            i++
        }
    }
    var ouput=[];
    ouput.push(tree);
    ouput.push(num);
    console.log(tree);
    res.json(ouput);
});


app2.get("/:entity/:attribute", (req, res,next) => {

    var entity=req.params.entity;
    var attribute=req.params.attribute;
    var root
    var l1;
    var l2=attribute;
    
    arr4.forEach(function (arrayItem) {
        if(arrayItem.DH_Entity_Name===entity){
            if(arrayItem.DH_Attribute_Name===attribute){
                if(arrayItem.DH_Schema_Name==="HORIZON_CDB"){
                    root="HORIZON";
                }
                else{
                    root="DARWIN";
                }
                l1=arrayItem.DH_Schema_Name+"."+arrayItem.DH_Entity_Name;
            }
        }
    })

    data={}
    var i=0;
    arr3.forEach(function (arrayItem) {
        if(arrayItem.DH_Entity_Name===entity){
            data[i]=[arrayItem.Application_User_ID,arrayItem.Application_Name]
            i++;
        }
    })

    var num=i;

    var tree=[{name:root,children:[{}]}]
    tree[0].children[0].name=l1
    tree[0].children[0].children=[{}]
    tree[0].children[0].children[0].name=l2
    tree[0].children[0].children[0].children=[]

    const len=i-1
    var i=0
    while(i<=len){
        tree[0].children[0].children[0].children[i]={}
        tree[0].children[0].children[0].children[i].name=data[i][0]
        tree[0].children[0].children[0].children[i].children=[{name:data[i][1]}]
        i++
    }


    var ouput=[];
    ouput.push(tree);
    ouput.push(num);
    console.log(tree);
    res.json(ouput);

    
}); 

app2.get("/application/name=/:app", (req, res,next) => {
    var app=req.params.app;
    var root=app;
    var l1;
    var ws5=wb.Sheets["DL_Info_Context_Apps"];
    var arr5=xlsx.utils.sheet_to_json(ws5)
    
    arr5.forEach(function (arrayItem) {
        if(arrayItem.Application_Name===app){
            l1=arrayItem.Application_User_ID;
            return false;
        }
    })

    var data ={}
    arr3.forEach(function (arrayItem) {
        if(arrayItem.Application_Name===app){
            if(data[arrayItem.DH_Schema_Name]===undefined){
                data[arrayItem.DH_Schema_Name]=new Set();
                data[arrayItem.DH_Schema_Name].add(arrayItem.DH_Entity_Name);
            }
            else{
                data[arrayItem.DH_Schema_Name].add(arrayItem.DH_Entity_Name);
            }
        }
    })
   
    for(var it in data){
        data[it]=Array.from(data[it])
    }
    var tree=[{name:root,children:[{}]}]
    tree[0].children[0].name=l1
    tree[0].children[0].children=[]

    var i=0;
    for(var it in data){
        var entArr=data[it];
        tree[0].children[0].children[i]={}
        tree[0].children[0].children[i].name=it;
        tree[0].children[0].children[i].children=[];
        for(var j=0;j<entArr.length;j++){
            tree[0].children[0].children[i].children[j]={}
            tree[0].children[0].children[i].children[j].name=entArr[j]
            tree[0].children[0].children[i].children[j]._collapsed=true;
            tree[0].children[0].children[i].children[j].children=[];
            arr4.forEach(function(arrayItem){
                if(arrayItem.DH_Entity_Name===entArr[j]){
                    tree[0].children[0].children[i].children[j].children.push({"name":arrayItem.DH_Attribute_Name})
                }
            })
        }
        i++;
    }
    res.json(tree);
})


//var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
var server_port2 = process.env.OCP_PORT2 || 8002

app2.listen(8002, server_ip_address, () => {
    console.log("Server 2 running on " + server_ip_address + ", port " + server_port2);
});
