const Voo = require('../models/Voo');
const Portao = require('../models/Portao');
const Passageiro = require('../models/Passageiro');

module.exports = {
    // Criar voo
    create: async (req, res) => {
        const { vooNumero, origin, destination, departureDateTime, gateId } = req.body;

        try {
            // Verificar se o portão está disponível, se fornecido
            if (gateId) {
                const portao = await Portao.findById(gateId);
                if (!portao) {
                    return res.status(404).json({ error: 'Portão não encontrado' });
                }
                if (!portao.available) {
                    return res.status(400).json({ error: 'Portão já está ocupado' });
                }
                // Marcar portão como ocupado
                portao.available = false;
                await portao.save();
            }

            const novoVoo = await Voo.create({
                vooNumero,
                origin,
                destination,
                departureDateTime,
                gateId,
                status: 'programado'
            });

            res.status(201).json(novoVoo);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao criar voo' });
        }
    },

    // Listar voos
    list: async (req, res) => {
        try {
            const voos = await Voo.find().populate('gateId');
            res.json(voos);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao listar voos' });
        }
    },

    // Atualizar status do voo
    updateStatus: async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;

        if (!['programado', 'embarque', 'concluido'].includes(status)) {
            return res.status(400).json({ error: 'Status inválido' });
        }

        try {
            const voo = await Voo.findById(id).populate('gateId');
            if (!voo) {
                return res.status(404).json({ error: 'Voo não encontrado' });
            }

            // Se o status for 'concluido', liberar o portão
            if (status === 'concluido' && voo.gateId) {
                const portao = await Portao.findById(voo.gateId);
                if (portao) {
                    portao.available = true;
                    await portao.save();
                }
            }

            voo.status = status;
            await voo.save();
            res.json(voo);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar status do voo' });
        }
    },

    // Relatório diário
    dailyReport: async (req, res) => {
        try {
            // Definir inicio e fim do dia atual
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            //Buscar voos do dia atual
            const voos = await Voo.find({
                departureDateTime: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            }).populate('gateId');

            //Para cada voo buscar passageiros
            const relatorio = await Promise.all(
                voos.map(async (voo) => {
                    const passageiros = await Passageiro.find({ vooId: voo._id });
                    return {
                        vooNumero: voo.vooNumero,
                        origin: voo.origin,
                        destination: voo.destination,
                        departureDateTime: voo.departureDateTime,
                        gate: voo.gateId ? voo.gateId.code : 'Não atribuido',
                        status: voo.status,
                        passageiros: passageiros.map(p => ({
                            nome: p.name,
                            cpf: p.cpf,
                            checkInStatus: p.checkInStatus
                        }))
                    };
                })
            );
            res.json(relatorio);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao gerar relatório diário'});
        }
    }
};