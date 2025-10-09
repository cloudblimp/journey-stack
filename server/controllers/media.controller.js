// Stub endpoints for signed upload flow
exports.getSignedUpload = async (req, res) => {
    try {
        // In production, generate S3/GCS signed URL
        // Here we return a stub response
        res.json({ uploadUrl: 'https://example.com/upload', mediaId: 'stub-media-id' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.confirmUpload = async (req, res) => {
    try {
        // Save media metadata and return stored doc (stubbed)
        res.json({ ok: true });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


