import {Router} from "express"

const router = Router();

router.get("/conversations", (req, res) => {
    res.send('conversation route');
})


export default router;