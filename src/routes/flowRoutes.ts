import { Request, Response, Router } from 'express';
import { 
    getAllFlowsByID,
    getFlowByID,
    createFlow,
    updateFlow,
    deleteFlow } from '../controllers/flowController';

const router = Router();

//Busca todas as movimentações específicas de um usuario
router.get('/flows/all/:id', async (req:Request, res:Response):Promise<void> =>{
    const id = Number(req.params.id);
    try{
        const flows = await getAllFlowsByID(id);
        res.json(flows);
    }catch(err){
        res.status(500).json({ err: 'Erro ao buscar movimentações' });
    }
})

//Busca uma movimentação especifica baseada no id da movimentação
router.get('/flows/:id', async (req:Request, res:Response):Promise<void> =>{
    const id = Number(req.params.id);
    try{
        const flow = await getFlowByID(id);
        res.json(flow);
    }catch(err){
        res.status(500).json({ err: 'Erro ao buscar movimentação' });
    }
})

//Cria uma movimentação
router.post('/flows', async (req:Request, res:Response):Promise<void> =>{
    try{
        const {idUsuario, tipo, classificacao, valor, saldo, dataMovimentacao, descricao} = req.body;
        const flow = await createFlow(idUsuario, tipo, classificacao, valor, saldo, dataMovimentacao, descricao);
        res.json(flow)
    }catch(err){
        res.status(500).json({err:'Erro ao criar movimentação'})
    }   
})

//Atualiza uma movimentação
router.put('/flows', async (req:Request, res:Response):Promise<void> =>{
    try{
        const {id, idUsuario, tipo, classificacao, valor, saldo, dataMovimentacao, descricao} = req.body;
        const flow = await updateFlow(id, idUsuario, tipo, classificacao, valor, saldo, dataMovimentacao, descricao);
        res.json(flow)
    }catch(err){
        res.status(500).json({err:'Erro ao atualizar movimentação'})
    }   
})

router.delete('/flows/:id', async (req:Request, res:Response):Promise<void> =>{
    const id = Number(req.params.id);
    try{
        const flow = await deleteFlow(id);
        res.json(flow);
    }catch(err){
        res.status(500).json({err:'Erro ao deletar movimentação'})
    }
})

export default router