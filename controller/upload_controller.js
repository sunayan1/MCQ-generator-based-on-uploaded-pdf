import supabase from '../config/supabaseClient.js';

const upload = async (req, res) => {
  try {
    const file = req.file;
    const fileName = `${Date.now()}_${file.originalname}`;

    const { data, error } = await supabase.storage
      .from('pdf_uploaded')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });
    if (error) throw error;
    res.status(200).json({ message: 'Uploaded!', path: data.path });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export { upload };
