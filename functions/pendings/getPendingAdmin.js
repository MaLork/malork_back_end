const admin = require('firebase-admin');
const db = admin.firestore();

module.exports = async (req,res) => {
    try {
        data = [];
        //let data = req.body;
        const uid = req.authId;
        const userDoc = await db.collection("users").doc(uid).get();
        if(userDoc.data().admin === true){
            const docRef = db.collection("pending").orderBy("time", "desc");
            const snapshot = await docRef.get();
            snapshot.forEach(doc => {
                const temp = doc.data();
                const {topic,user,status} = temp;
                const time = temp.time.toDate();
                const content = temp.content.slice(0,50);
                tempdata = {
                    topic,
                    user,
                    status,
                    time,
                    content,
                    id: doc.id
                };
                if(temp.postId) {
                    tempdata.postId = temp.postId;
                }
                data.push(tempdata)
            });
            return res.send(data)
        }else{
            res.status(401).send({
                error: "Unauthorized",
            })
        }
       
    } catch (err) {
        res.status(500).send("Error")
        console.log(err);
    }
}