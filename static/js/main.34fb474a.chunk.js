(this.webpackJsonpapp=this.webpackJsonpapp||[]).push([[0],{75:function(e,t,n){},76:function(e,t,n){},82:function(e,t,n){"use strict";n.r(t);var s=n(0),o=n.n(s),a=n(12),i=n.n(a),r=(n(75),n(51)),l=n(20),c=n(21),d=n(11),u=n(23),h=n(22),b=(n(76),n(54));n(83);b.a.initializeApp({apiKey:"AIzaSyB0h22wiHLitL3J_-0XqYdZ3HAkuKAofl4",authDomain:"what2do-fabc5.firebaseapp.com",databaseURL:"https://what2do-fabc5-default-rtdb.firebaseio.com",projectId:"what2do-fabc5",storageBucket:"what2do-fabc5.appspot.com",messagingSenderId:"917958482489",appId:"1:917958482489:web:3b000c19e8fd12cde38be8",measurementId:"G-FNTXD7HQC0"});var m=b.a,p=n(7),j=n(114),g=n(119),f=n(3),v=Object(p.a)((function(e){return{root:{color:e.palette.getContrastText("#7CB7AF"),backgroundColor:"#7CB7AF",margin:"0 1em","&:hover":{backgroundColor:"#16796F"},"&:disabled":{backgroundColor:"#9CA89E"}}}}))(j.a),x=Object(p.a)((function(e){return{root:{minWidth:"15em","& label.Mui-focused":{color:"#16796F"},"& input:valid + fieldset":{borderColor:"#7CB7AF",borderWidth:2},"& input:invalid + fieldset":{borderColor:"#16796F",borderWidth:2},"& input:valid:focus + fieldset":{borderLeftWidth:6,borderColor:"#16796F",textColor:"#16796F",padding:"4px !important"}}}}))(g.a),O=function(e){Object(u.a)(n,e);var t=Object(h.a)(n);function n(e){var s;return Object(l.a)(this,n),(s=t.call(this,e)).sendItemInput=function(e){e.preventDefault(),console.log(s.state.currentInput),document.getElementById("userinput").value="",s.props.receiveItemInput(s.state.currentInput)},s.state={currentInput:""},s.handleChange=s.handleChange.bind(Object(d.a)(s)),s.sendItemInput=s.sendItemInput.bind(Object(d.a)(s)),s}return Object(c.a)(n,[{key:"handleChange",value:function(e){this.setState({currentInput:e.target.value})}},{key:"render",value:function(){var e=this;return Object(f.jsx)("div",{children:Object(f.jsxs)("form",{children:[Object(f.jsx)(x,{id:"userinput",label:this.props.username+", enter an item:",variant:"outlined",size:"small",onChange:this.handleChange,onKeyPress:function(t){"Enter"===t.key&&e.sendItemInput(t)}}),Object(f.jsx)(v,{className:"color-button",variant:"contained",color:"primary",size:"small",disableElevation:!0,onClick:this.sendItemInput,children:"Submit"})]})})}}]),n}(o.a.Component),D=n(118),I=(Object(p.a)((function(e){return{root:{color:e.palette.getContrastText("#7CB7AF"),backgroundColor:"#7CB7AF",margin:"0 1em","&:hover":{backgroundColor:"#16796F"},"&:disabled":{backgroundColor:"#9CA89E"}}}}))(j.a),Object(p.a)({root:{color:"#7CB7AF","&$checked":{color:"#16796F"},padding:"0 0 0 0.5em"},checked:{}})(D.a)),C=function(e){Object(u.a)(n,e);var t=Object(h.a)(n);function n(e){var s;return Object(l.a)(this,n),(s=t.call(this,e)).state={entries:[],voters:[],voteCount:[],didVote:[],isLoaded:!1},s.deleteVote=s.deleteVote.bind(Object(d.a)(s)),s.addVote=s.addVote.bind(Object(d.a)(s)),s.renderWithVoting=s.renderWithVoting.bind(Object(d.a)(s)),s.renderWithoutVoting=s.renderWithoutVoting.bind(Object(d.a)(s)),s}return Object(c.a)(n,[{key:"componentDidMount",value:function(){var e=this;m.firestore().collection("sessions").doc(this.props.sessionID).collection("items").orderBy("count","desc").onSnapshot((function(t){var n=[],s=[],o=[],a=[];t.forEach((function(t){n=n.concat(t.id),s=s.concat(t.data().count),a=a.concat(t.data().votes.includes(e.props.username)),o.push(t.data().votes)})),e.setState({entries:n,voters:o,voteCount:s,didVote:a,isLoaded:!0})}))}},{key:"deleteVote",value:function(e){var t=m.firestore().collection("sessions").doc(this.props.sessionID),n=e.currentTarget.value;console.log("Deleting",n),t.collection("items").doc(n).update({count:m.firestore.FieldValue.increment(-1),votes:m.firestore.FieldValue.arrayRemove(this.props.username)}),t.collection("items").doc(n).get().then((function(e){e.exists&&0===e.data().count&&t.collection("items").doc(n).delete().then((function(){console.log("Document successfully deleted!")})).catch((function(e){console.error("Error removing document: ",e)}))}))}},{key:"addVote",value:function(e){var t=e.currentTarget.value;console.log("Adding vote",t),this.props.receiveItemInput(t)}},{key:"renderWithVoting",value:function(){for(var e=[],t=0;t<this.state.entries.length;t++){var n=this.state.entries[t];e.push(Object(f.jsxs)("li",{className:"itemList",children:[n," - ",this.state.voteCount[t]," votes",this.state.didVote[t]?Object(f.jsx)(I,{value:n,checked:this.state.didVote[t],onChange:this.deleteVote}):Object(f.jsx)(I,{value:n,checked:this.state.didVote[t],onChange:this.addVote}),Object(f.jsx)("br",{}),Object(f.jsxs)("em",{children:["(",this.state.voters[t].join(", "),")"]})]}))}return Object(f.jsxs)("div",{className:"list",children:[Object(f.jsx)("h3",{children:"Current Items:"}),Object(f.jsx)("ul",{children:0==e.length?"No items. Add an item to display here.":e})]})}},{key:"renderWithoutVoting",value:function(){for(var e=[],t=0;t<this.state.entries.length;t++){var n=this.state.entries[t];e.push(Object(f.jsxs)("li",{id:t,children:[n," - ",this.state.voteCount[t]," votes",Object(f.jsx)("br",{}),Object(f.jsxs)("em",{children:["(",this.state.voters[t].join(", "),")"]})]}))}return Object(f.jsxs)("div",{className:"list",children:[Object(f.jsx)("h3",{children:"Current Items:"}),Object(f.jsx)("ul",{children:0==e.length?"No items. Add an item to display here.":e})]})}},{key:"render",value:function(){return this.state.isLoaded?null!=this.props.username?Object(f.jsx)(this.renderWithVoting,{}):Object(f.jsx)(this.renderWithoutVoting,{}):Object(f.jsx)("div",{children:Object(f.jsxs)("p",{children:["Current Items:",Object(f.jsx)("br",{}),"Loading..."]})})}}]),n}(o.a.Component),w=Object(p.a)((function(e){return{root:{color:e.palette.getContrastText("#7CB7AF"),backgroundColor:"#7CB7AF",margin:"0 1em","&:hover":{backgroundColor:"#16796F"},"&:disabled":{backgroundColor:"#9CA89E"}}}}))(j.a),S=function(e){Object(u.a)(n,e);var t=Object(h.a)(n);function n(e){var s;return Object(l.a)(this,n),(s=t.call(this,e)).state={users:[]},s.deleteUser=s.deleteUser.bind(Object(d.a)(s)),s}return Object(c.a)(n,[{key:"componentDidMount",value:function(){var e=this;m.firestore().collection("sessions").doc(this.props.sessionID).onSnapshot((function(t){var n=[];t.data().users.forEach((function(e){n=n.concat(e)})),e.setState({users:n})}))}},{key:"deleteUser",value:function(e){var t=e.currentTarget.value;if(window.confirm("You are about to delete user "+t+" and all their votes.\nProceed?")){var n=m.firestore().collection("sessions").doc(this.props.sessionID);console.log("Deleting user",t),n.update({users:m.firestore.FieldValue.arrayRemove(t)}),console.log("after update"),n.collection("items").where("votes","array-contains",t).get().then((function(e){console.log(e.empty),e.forEach((function(e){console.log("votes contains "+t+" ",e.data()),n.collection("items").doc(e.id).update({count:m.firestore.FieldValue.increment(-1),votes:m.firestore.FieldValue.arrayRemove(t)})}))})),console.log("after array-contains"),n.collection("items").where("count","==",0).onSnapshot((function(e){e.forEach((function(e){n.collection("items").doc(e.id).delete().then((function(){console.log("Document successfully deleted!")})).catch((function(e){console.error("Error removing document: ",e)}))}))}))}}},{key:"render",value:function(){var e=this;return Object(f.jsxs)("div",{className:"list",children:[Object(f.jsx)("h3",{children:"Users in Current Session:"}),Object(f.jsx)("ul",{children:0==this.state.users.length?"No users have joined.":this.state.users.map((function(t){return Object(f.jsxs)("li",{children:[t,Object(f.jsx)(w,{value:t,className:"color-button",variant:"contained",color:"primary",size:"small",disableElevation:!0,onClick:e.deleteUser,children:"Remove User"})]},t)}))})]})}}]),n}(o.a.Component),y=n(121),k=n(120),E=n(117),F=Object(p.a)((function(e){return{root:{color:e.palette.getContrastText("#7CB7AF"),backgroundColor:"#7CB7AF",margin:"0 1em","&:hover":{backgroundColor:"#16796F"},"&:disabled":{backgroundColor:"#9EB7B4"}}}}))(j.a),N=Object(p.a)((function(e){return{root:{marginLeft:15,minWidth:"15em","& label.Mui-focused":{color:"#16796F"},"& input:valid + fieldset":{borderColor:"#7CB7AF",borderWidth:2},"& input:invalid + fieldset":{borderColor:"#16796F",borderWidth:2},"& input:valid:focus + fieldset":{borderLeftWidth:6,borderColor:"#16796F",textColor:"#16796F",padding:"4px !important"}}}}))(g.a),B=Object(p.a)((function(e){return{root:{marginRight:15,minWidth:"8em",boxBorderColor:"#16796F","& .Mui-focused":{color:"#16796F",borderColor:"#16796F"},"& .MuiOutlinedInput-notchedOutline":{border:"2px solid #7CB7AF"},"& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":{border:"2px solid #16796F"},"&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":{border:"2px solid #16796F"}}}}))(k.a),V=function(e){Object(u.a)(n,e);var t=Object(h.a)(n);function n(e){var s;return Object(l.a)(this,n),(s=t.call(this,e)).handleNameChange=function(e){e.preventDefault(),s.setState({username:e.target.value})},s.handleNameSubmit=function(e){if(""===s.state.username)window.alert("Display name cannot be empty!"),e.preventDefault();else{s.setState({hasName:!0});var t=m.firestore().collection("sessions").doc(s.props.sessionID),n=s.state.username.trim();s.setState({username:n}),t.get().then((function(e){if(e.exists)return console.log("Document data:",e.data()),e.data().users.includes(n),t.update({users:m.firestore.FieldValue.arrayUnion(n)});console.log("No such document!")}))}},s.resetName=function(){s.setState({username:"",hasName:!1})},s.receiveItemInput=function(e){var t=m.firestore().collection("sessions").doc(s.props.sessionID).collection("items").doc(e);t.get().then((function(e){e.exists?(console.log("Document data:",e.data()),e.data().votes.includes(s.state.username)||t.update({count:m.firestore.FieldValue.increment(1),votes:m.firestore.FieldValue.arrayUnion(s.state.username)})):(console.log("No such document!"),t.set({votes:[s.state.username],count:1}).then((function(){console.log("Document successfully written!")})).catch((function(e){console.error("Error writing document: ",e)})))})).catch((function(e){console.log("Error getting document:",e)}))},s.handleSessionChange=function(e){e.preventDefault(),console.log(e.target.value),s.setState({tempExternalID:e.target.value})},s.handleDateChange=function(e){var t=e.target.value;console.log(t);var n=new Date;n.setFullYear(t.substring(0,4)),n.setMonth(parseInt(t.substring(5,7))-1),n.setDate(t.substring(8)),console.log(n),s.setState({tempExpDate:n})},s.dateToString=function(e){return e.getFullYear()+"-"+("0"+(e.getMonth()+1)).slice(-2)+"-"+("0"+e.getDate()).slice(-2)},s.state={username:"",hasName:!1,existingUsers:[],tempExternalID:"",expDate:null,tempExpDate:null},s.handleNameChange=s.handleNameChange.bind(Object(d.a)(s)),s.handleSessionChange=s.handleSessionChange.bind(Object(d.a)(s)),s.handleSessionSubmit=s.handleSessionSubmit.bind(Object(d.a)(s)),s.handleExpirationExtension=s.handleExpirationExtension.bind(Object(d.a)(s)),s.handleDateChange=s.handleDateChange.bind(Object(d.a)(s)),s}return Object(c.a)(n,[{key:"componentDidMount",value:function(){var e=this,t=new URLSearchParams(window.location.search);t.set("session",this.props.externalID),window.history.replaceState({},"","".concat(window.location.pathname,"?").concat(t)),m.firestore().collection("sessions").doc(this.props.sessionID).onSnapshot((function(t){var n=[];n.push(Object(f.jsx)("option",{value:"DEFAULT"},"default")),t.data().users.forEach((function(e){n.push(Object(f.jsx)("option",{value:e,children:e},e))})),e.setState({existingUsers:n,expDate:t.data().expirationDate.toDate()})}))}},{key:"handleExpirationExtension",value:function(){var e=this,t=this.state.tempExpDate,n=m.firestore().collection("sessions").doc(this.props.sessionID);n.get().then((function(s){console.log(t),n.update({expirationDate:m.firestore.Timestamp.fromDate(t)}).then((function(){console.log("expiration date has been changed to ",e.state.tempExpDate)}))})).catch((function(e){})),this.setState({expDate:t})}},{key:"handleSessionSubmit",value:function(e){var t=this;if(e.preventDefault(),console.log(this.state.tempExternalID),this.state.tempExternalID.includes("/"))window.alert("This is an invalid session ID. Please avoid using forward slashes (/).");else{var n=m.firestore().collection("sessions").where("externalID","==",this.state.tempExternalID);n.get().then((function(e){e.empty?n.get().then((function(e){e.empty?t.props.renameSession(t.state.tempExternalID):window.alert("This session ID is already being used. Please enter a new session ID.")})).catch((function(e){console.log("Error getting documents: ",e)})):window.alert("This session ID is already being used. Please enter a new session ID.")}))}}},{key:"render",value:function(){var e=this,t=new Date;return t.setDate((new Date).getDate()+1),console.log(this.state.expDate),console.log(window.location.host+"/"+window.location.pathname+window.location.search),this.state.hasName?Object(f.jsxs)(o.a.Fragment,{children:[Object(f.jsx)(this.props.SplashBanner,{text:"Add items or leave your votes"}),Object(f.jsxs)("div",{className:"general",children:[Object(f.jsx)(O,{username:this.state.username,receiveItemInput:this.receiveItemInput}),Object(f.jsx)("div",{children:Object(f.jsx)(C,{username:this.state.username,receiveItemInput:this.receiveItemInput,sessionID:this.props.sessionID})}),Object(f.jsx)("br",{}),Object(f.jsx)(F,{className:"color-button",variant:"contained",color:"primary",size:"small",disableElevation:!0,onClick:this.resetName,children:"Go back"})]})]}):Object(f.jsxs)(o.a.Fragment,{children:[Object(f.jsx)(this.props.SplashBanner,{text:"Welcome to your What2Do session!"}),Object(f.jsxs)("div",{className:"general",children:[Object(f.jsxs)("div",{className:"loginContainer",children:[Object(f.jsx)("h3",{children:"Select an existing user or enter a new name"}),Object(f.jsxs)(B,{variant:"outlined",size:"small",children:[Object(f.jsx)(y.a,{htmlFor:"outlined-age-native-simple",children:"Log in as:"}),Object(f.jsx)(E.a,{native:!0,onChange:this.handleNameChange,label:"Log in as:",children:this.state.existingUsers})]}),"OR",Object(f.jsx)(N,{id:"nameInput",label:"Enter your name:",variant:"outlined",size:"small",onChange:this.handleNameChange,onKeyPress:function(t){"Enter"===t.key&&e.handleNameSubmit(t)}}),Object(f.jsx)(F,{className:"color-button",variant:"contained",color:"primary",size:"small",disableElevation:!0,onClick:this.handleNameSubmit,children:" Go! "}),Object(f.jsx)("br",{})]}),Object(f.jsx)("div",{className:"loginContainer",children:Object(f.jsxs)("div",{className:"row",children:[Object(f.jsx)(S,{username:this.state.username,sessionID:this.props.sessionID}),Object(f.jsx)(C,{sessionID:this.props.sessionID})]})}),Object(f.jsx)("br",{}),Object(f.jsxs)("div",{className:"loginContainer",children:[Object(f.jsx)("h3",{children:"Change this What2Do"}),null!==this.state.expDate&&Object(f.jsxs)("div",{children:["This session expires on",Object(f.jsxs)("div",{className:"child",children:[Object(f.jsx)(g.a,{id:"date",type:"date",onChange:this.handleDateChange,defaultValue:this.dateToString(this.state.expDate),inputProps:{min:this.dateToString(t)}}),Object(f.jsx)(F,{className:"color-button",variant:"contained",color:"primary",size:"small",disableElevation:!0,onClick:function(){return e.handleExpirationExtension()},children:" Update "})]}),Object(f.jsx)("br",{})]}),Object(f.jsxs)("form",{children:[Object(f.jsx)(N,{id:"changeExternalID",label:"Change session ID:",variant:"outlined",size:"small",onChange:this.handleSessionChange,onKeyPress:function(t){"Enter"===t.key&&e.handleSessionSubmit(t)}}),Object(f.jsx)(F,{className:"color-button",variant:"contained",color:"primary",size:"small",disableElevation:!0,disabled:""===this.state.tempExternalID,onClick:this.handleSessionSubmit,children:"Submit"})]}),Object(f.jsx)("br",{}),Object(f.jsx)(F,{className:"color-button",variant:"contained",color:"primary",size:"small",disableElevation:!0,onClick:this.props.resetSession,children:"Leave session"}),Object(f.jsx)(F,{className:"color-button",variant:"contained",color:"primary",size:"small",disableElevation:!0,onClick:function(){navigator.clipboard.writeText("https://"+window.location.host+window.location.pathname+window.location.search)},children:"Click to copy session link!"})]})]})]})}}]),n}(s.Component),W=Object(p.a)((function(e){return{root:{color:e.palette.getContrastText("#7CB7AF"),backgroundColor:"#7CB7AF",margin:"0 1em","&:hover":{backgroundColor:"#16796F"},"&:disabled":{backgroundColor:"#9CA89E"}}}}))(j.a),A=Object(p.a)((function(e){return{root:{width:"25%",minWidth:"15em","& label.Mui-focused":{color:"#16796F"},"& input:valid + fieldset":{borderColor:"#7CB7AF",borderWidth:2},"& input:invalid + fieldset":{borderColor:"#16796F",borderWidth:2},"& input:valid:focus + fieldset":{borderLeftWidth:6,borderColor:"#16796F",textColor:"#16796F",padding:"4px !important"}}}}))(g.a),L=function(e){Object(u.a)(n,e);var t=Object(h.a)(n);function n(){var e;return Object(l.a)(this,n),(e=t.call(this)).handleExternalIDChange=function(t){t.preventDefault(),e.setState({tempExternalID:t.target.value})},e.renameSession=function(t){m.firestore().collection("sessions").doc(e.state.sessionID).update({externalID:t}),e.setState({externalID:t});var n=new URLSearchParams(window.location.search);n.set("session",t),window.history.replaceState({},"","".concat(window.location.pathname,"?").concat(n)),window.alert("Successfully changed session ID.")},e.state={sessionID:null,externalID:null,tempExternalID:null},e.createSession=e.createSession.bind(Object(d.a)(e)),e.resetSession=e.resetSession.bind(Object(d.a)(e)),e.renameSession=e.renameSession.bind(Object(d.a)(e)),e.handleExternalIDChange=e.handleExternalIDChange.bind(Object(d.a)(e)),e.SplashBanner=e.SplashBanner.bind(Object(d.a)(e)),e.CreditsBanner=e.CreditsBanner.bind(Object(d.a)(e)),e.Blurb=e.Blurb.bind(Object(d.a)(e)),e}return Object(c.a)(n,[{key:"componentDidMount",value:function(){var e=this,t=new URLSearchParams(window.location.search).get("session"),n=m.firestore().collection("sessions");""!==t&&null!==t&&n.where("externalID","==",t).get().then((function(n){n.empty?e.setState({sessionID:"",externalID:""}):n.forEach((function(n){e.setState({sessionID:n.id,externalID:t})}))})),n.get().then((function(e){var t=new Date;e.forEach((function(e){e.data().expirationDate.toDate()<t&&(n.doc(e.id).collection("items").get().then((function(e){e.forEach((function(e){e.ref.delete().then((function(){console.log("documents in subcollection of expired document has been deleted")}))}))})),e.ref.delete().then((function(){console.log("expired documment has been deleted")})))}))}))}},{key:"createSession",value:function(){var e=this;console.log("this.state.tempExternalID: "+this.state.tempExternalID);var t=m.firestore().collection("sessions");if(null!=this.state.tempExternalID&&this.state.tempExternalID.includes("/"))return this.setState({sessionID:null}),void window.alert("This is an invalid session ID. Please avoid using forward slashes (/).");t.where("externalID","==",this.state.tempExternalID).get().then((function(n){if(n.empty){var s=new Date;s.setDate(s.getDate()+30),t.add({users:[],externalID:"",expirationDate:m.firestore.Timestamp.fromDate(s)}).then((function(n){console.log("Document successfully written! Doc.id: "+n.id),null===e.state.tempExternalID?(e.setState({sessionID:n.id,externalID:n.id}),t.doc(n.id).update({externalID:n.id})):(e.setState({sessionID:n.id,externalID:e.state.tempExternalID}),t.doc(n.id).update({externalID:e.state.tempExternalID}))})).catch((function(e){console.error("Error writing document: ",e)}))}else e.setState({sessionID:null}),window.alert("This session ID already exists.\nPlease input a different session ID.")}))}},{key:"resetSession",value:function(){this.setState({sessionID:null,externalID:null}),window.location.href=window.location.href.split("?")[0]}},{key:"SplashBanner",value:function(e){return Object(f.jsx)("div",{className:"banner splash",children:Object(f.jsx)("h1",{children:e.text})})}},{key:"Blurb",value:function(e){return Object(f.jsxs)("div",{className:"summary",children:["What2Do is a multipurpose polling tool designed to facilitate group decisions. Users can brainstorm ideas together, vote on their favorites, and then select the most popular option(s).",Object(f.jsx)("br",{}),Object(f.jsx)("br",{}),Object(f.jsxs)("ol",{className:"instructionList",children:[Object(f.jsx)("strong",{children:"Here's how to get started:"}),Object(f.jsx)("li",{children:" Select a personalized URL or let What2Do generate one - this will be used to share & access your What2Do in the future!"}),Object(f.jsx)("li",{children:" Create a username that will represent your votes"}),Object(f.jsx)("li",{children:" Vote for existing items or add your own to the poll!"})]})]})}},{key:"CreditsBanner",value:function(e){return Object(f.jsxs)("div",{className:"banner credits",children:[Object(f.jsx)("h3",{children:"Brought to you by:"}),[{name:"Sana Suse",github:"https://github.com/sanasc/",linkedin:"https://www.linkedin.com/in/sanasuse/",email:"15sanasc@gmail.com"},{name:"Irene Wachirawutthichai",github:"https://github.com/lalinw/",linkedin:"https://www.linkedin.com/in/lalinw/",email:"i.lalinw@gmail.com"},{name:"David Kang",github:"https://github.com/DaviidK",linkedin:"https://www.linkedin.com/in/david-j-kang",email:"kang.david.j@gmail.com"}].map((function(e){return Object(f.jsxs)("div",{className:"person",children:[e.name,Object(f.jsx)("br",{}),Object(f.jsx)("a",{href:e.github,target:"_blank",rel:"noopener noreferrer",children:"Github"})," | ",Object(f.jsx)("a",{href:e.linkedin,target:"_blank",rel:"noopener noreferrer",children:"LinkedIn"})," | ",Object(f.jsx)("a",{href:"mailto:"+e.email,target:"_blank",rel:"noopener noreferrer",children:e.email})]},e.name)}))]})}},{key:"render",value:function(){var e,t=this;return null===this.state.sessionID?Object(f.jsxs)(o.a.Fragment,{children:[Object(f.jsx)(this.SplashBanner,{text:"Welcome to What2Do"}),Object(f.jsxs)("div",{className:"splash",children:[Object(f.jsx)("h2",{children:"Create a new session below!"}),Object(f.jsx)("br",{}),Object(f.jsx)(A,{id:"externalIDInput",label:"Pick your own custom URL!",variant:"outlined",onChange:this.handleExternalIDChange,onKeyPress:function(e){"Enter"===e.key&&t.createSession(e)}}),Object(f.jsx)(W,{className:"color-button",variant:"contained",color:"primary",size:"large",disableElevation:!0,disabled:null==this.state.tempExternalID||""==this.state.tempExternalID,onClick:this.createSession,children:"Submit"}),Object(f.jsx)("p",{children:Object(f.jsx)("i",{children:"OR"})}),Object(f.jsx)(W,(e={className:"color-button",variant:"contained",color:"primary",disableElevation:!0,size:"large"},Object(r.a)(e,"className","btn btn-outline-dark btn-lg btn-block"),Object(r.a)(e,"onClick",this.createSession),Object(r.a)(e,"children","Use a randomly generated URL"),e)),Object(f.jsx)("br",{})]}),Object(f.jsx)(this.Blurb,{}),Object(f.jsx)(this.CreditsBanner,{})]}):""!==this.state.sessionID?Object(f.jsx)(o.a.Fragment,{children:Object(f.jsx)(V,{sessionID:this.state.sessionID,resetSession:this.resetSession,renameSession:this.renameSession,externalID:this.state.externalID,SplashBanner:this.SplashBanner})}):(console.log("Made it to the else-if!"),window.alert("This is an invalid session ID."),void this.resetSession())}}]),n}(s.Component),T=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,123)).then((function(t){var n=t.getCLS,s=t.getFID,o=t.getFCP,a=t.getLCP,i=t.getTTFB;n(e),s(e),o(e),a(e),i(e)}))};i.a.render(Object(f.jsx)(L,{}),document.getElementById("root")),T()}},[[82,1,2]]]);
//# sourceMappingURL=main.34fb474a.chunk.js.map