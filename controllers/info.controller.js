const infoController = {
    getInfo: (req, res) => {
        res.status(200).json({
            status: 200,
            message: 'Server info-endpoint',
            data: {
                studentName: 'Janko Seremak',
                studentNumber: 2191216,
                description: 'Testing description'
            }
        });
    }
}


module.exports = infoController;