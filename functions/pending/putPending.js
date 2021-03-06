const admin = require('firebase-admin');
const db = admin.firestore();

module.exports = async (req,res)=>{
    try{
        const ID = req.params.id;
        const docRef = db.collection("pending").doc(ID);
        const doc = await docRef.get();
        const temp = doc.data();
        if (doc.exists) {
            const uid = req.authId;
            const userDoc = await db.collection("users").doc(uid).get();
            if(userDoc.data().admin){
                if (temp.status !== "pending"){
                    res.status(403).send("Already decide");
                    return 0;
                }else{
                    const approve = req.body.approve;
                    if (approve===true) {
                        const {content, topic, user, time} = temp;
                        const nowCom = 1;
                        const pick = 0;
                        const approvedTime = admin.firestore.Timestamp.now()
                        const data = {
                            content, topic, user, nowCom, pick, approvedTime, time, uid
                        }
                        const statRef = db.collection("stats").doc("now"); 
                        const stat = await statRef.get();
                        const postId = stat.data().post;
                        const post = await db.collection("post").doc((postId).toString()).set(data);
                        const upId = await statRef.set({post: postId+1},{merge: true});
                        const update = await docRef.set({status: "accepted",postId},{merge: true});
                        return res.send("Approved")
                    }else if(approve===false){
                        const update = await docRef.set({status: "rejected"},{merge: true})
                        return res.send("Rejected")
                    }else{
                        res.status(400).send("Wrong format");
                    }
                }
            } else {
                res.status(401).send({
                    error: "Unauthorized",
                })
            }    
        } else {
            console.log("No such document!");
            res.status(404).send("No such document!");
            return 0;
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send("error")
    }
}
