const admin = require('firebase-admin');
const db = admin.firestore();

module.exports = async (req,res) => {
    try {
        const snapshot = await db.collection('post').get();
        data = []
        snapshot.forEach((doc) => {
            let temp = doc.data();
            const {topic, user} = temp;
            const time = temp.time.toDate();
            const havePickedAnswer = temp.pick!==0;
            const content = temp.content.slice(0,50);
            data.push({
                topic,
                user,
                time,
                havePickedAnswer,
                content,
                id: doc.id,
            })
          })
        return res.send(data)
    } catch (err) {
        console.log(err)
        return res.status(500).send("error")
    }
}

