export interface Photo {
  id: number;
  url: string;
  date: string;
}

const mockPhotos: Photo[] = [
  {
    id: 1,
    url: "https://rsggroup.com/wp-content/uploads/2023/05/rsg-group-brands-brand-card-goldsgym.jpg",
    date: "2024-10-28"
  },
  {
    id: 2,
    url: "https://thumbs.dreamstime.com/b/manteni%C3%A9ndose-fuerte-en-gym-hombres-j%C3%B3venes-guapos-estando-fuertes-el-gimnasio-y-los-m%C3%BAsculos-flexantes-modelo-de-fitness-139337925.jpg",
    date: "2024-10-27"
  },
  {
    id: 3,
    url: "https://st.depositphotos.com/1000689/61339/i/450/depositphotos_613397714-stock-photo-gym-full-body-workout-muscular.jpg",
    date: "2024-10-26"
  }
];

const API_URL = 'https://abcd1234.ngrok.io';

export const PhotoService = {
  getPhotos: (): Promise<Photo[]> => {
    return Promise.resolve(mockPhotos);
  },

  getOldestAndNewestPhotos: (): Promise<{ oldest: Photo; newest: Photo }> => {
    const sortedPhotos = [...mockPhotos].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    return Promise.resolve({
      oldest: sortedPhotos[0],
      newest: sortedPhotos[sortedPhotos.length - 1]
    });
  },

  addPhoto: async (photo: { uri: string; type: string; fileName?: string }): Promise<Photo> => {
    try {
      const formData = new FormData();
      formData.append('photo', {
        uri: photo.uri,
        type: photo.type,
        name: photo.fileName || 'photo.jpg',
      });

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error('Error al subir la foto');
      }

      const data = await response.json();
      const newPhoto = {
        id: mockPhotos.length + 1,
        url: data.url,
        date: new Date().toISOString()
      };

      mockPhotos.push(newPhoto);
      return newPhoto;
    } catch (error) {
      console.error('Error subiendo la foto:', error);
      throw error;
    }
  },

  deletePhotos: async (photoIds: number[]): Promise<void> => {
    try {
      const deletePromises = photoIds.map(async (id) => {
        const photo = mockPhotos.find(p => p.id === id);
        if (!photo) return;

        const filename = photo.url.split('/').pop();
        if (!filename) return;

        const response = await fetch(`${API_URL}/delete/${filename}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`Error al borrar la foto ${filename}`);
        }

        const index = mockPhotos.findIndex(p => p.id === id);
        if (index !== -1) {
          mockPhotos.splice(index, 1);
        }
      });

      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error al borrar las fotos:', error);
      throw error;
    }
  }
};