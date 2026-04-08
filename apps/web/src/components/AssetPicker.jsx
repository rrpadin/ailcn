import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, FileVideo, FileAudio, FileText, Image as ImageIcon, Check } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const AssetPicker = ({ type, onSelect, selectedId, triggerText = "Select Asset" }) => {
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAssets();
    }
  }, [isOpen, type]);

  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      let filter = '';
      if (type === 'video') filter = 'type="video"';
      else if (type === 'audio') filter = 'type="audio"';
      else if (type === 'document') filter = 'type="document"';
      else if (type === 'image') filter = 'type="image"';

      const records = await pb.collection('assets').getFullList({
        filter,
        sort: '-created',
        $autoCancel: false
      });
      setAssets(records);
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (asset) => {
    onSelect(asset);
    setIsOpen(false);
  };

  const getIcon = (assetType) => {
    switch (assetType) {
      case 'video': return <FileVideo className="w-8 h-8 text-blue-500" />;
      case 'audio': return <FileAudio className="w-8 h-8 text-purple-500" />;
      case 'document': return <FileText className="w-8 h-8 text-orange-500" />;
      case 'image': return <ImageIcon className="w-8 h-8 text-green-500" />;
      default: return <FileText className="w-8 h-8 text-muted-foreground" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" type="button">
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select {type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Asset'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <ScrollArea className="h-[300px] border rounded-md p-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredAssets.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <p>No assets found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {filteredAssets.map((asset) => (
                  <div
                    key={asset.id}
                    onClick={() => handleSelect(asset)}
                    className={`relative cursor-pointer group rounded-lg border p-3 flex flex-col items-center text-center transition-all hover:border-primary hover:bg-primary/5 ${
                      selectedId === asset.id ? 'border-primary bg-primary/10 ring-1 ring-primary' : ''
                    }`}
                  >
                    {selectedId === asset.id && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                    
                    {asset.type === 'image' && asset.file ? (
                      <div className="w-16 h-16 mb-2 rounded overflow-hidden bg-muted">
                        <img 
                          src={pb.files.getUrl(asset, asset.file, { thumb: '100x100' })} 
                          alt={asset.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 mb-2 rounded bg-muted flex items-center justify-center">
                        {getIcon(asset.type)}
                      </div>
                    )}
                    
                    <span className="text-xs font-medium line-clamp-2 w-full" title={asset.name}>
                      {asset.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssetPicker;