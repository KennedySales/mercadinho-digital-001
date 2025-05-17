
import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { File } from '@/lib/types';

interface ImageUploadProps {
  currentImage?: string;
  onImageUpload: (file: File) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ currentImage, onImageUpload }) => {
  const [preview, setPreview] = useState<string | undefined>(currentImage);
  const [isHovering, setIsHovering] = useState(false);
  
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        
        onImageUpload({
          name: selectedFile.name,
          url: result,
          size: selectedFile.size,
          type: selectedFile.type
        });
      };
      
      reader.readAsDataURL(selectedFile);
    }
  }, [onImageUpload]);

  const handleRemoveImage = useCallback(() => {
    setPreview(undefined);
    onImageUpload({ name: '', url: '' });
  }, [onImageUpload]);

  return (
    <div className="w-full">
      <div 
        className={`relative border-2 border-dashed rounded-lg ${
          preview ? 'border-gray-200' : 'border-gray-300'
        } transition-all hover:border-gray-400 bg-gray-50 flex flex-col items-center justify-center h-48`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {preview ? (
          <>
            <img 
              src={preview} 
              alt="Preview" 
              className="object-contain w-full h-full rounded-lg" 
            />
            {isHovering && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg">
                <div className="space-x-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => document.getElementById('fileInput')?.click()}
                  >
                    <Upload size={16} className="mr-2" />
                    Trocar
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveImage}
                  >
                    <X size={16} className="mr-2" />
                    Remover
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-600 mb-1">Clique para adicionar uma imagem</p>
            <p className="text-xs text-gray-500">SVG, PNG, JPG ou GIF</p>
          </div>
        )}

        <input 
          id="fileInput"
          type="file" 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange}
        />
      </div>
      
      {!preview && (
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('fileInput')?.click()}
          className="w-full mt-2"
        >
          <Upload size={16} className="mr-2" />
          Selecionar Imagem
        </Button>
      )}
    </div>
  );
};

export default ImageUpload;
