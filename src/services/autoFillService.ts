import { useState, useRef, useEffect } from 'react';
import api from '@/api/axiosConfig';
import { notification } from 'antd';

interface AutofillItem {
    id: number;
    [key: string]: any;
}

export interface EntityConfig {
    endpoint: string;
    nameField: string;
    createEndpoint?: string;
}
export const entityConfigs: Record<string, EntityConfig> = {
    school: {
        endpoint: '/v1/schools',
        nameField: 'schoolName',
    },
    degree: {
        endpoint: '/v1/degrees',
        nameField: 'degreeTitle',
    },
    major: {
        endpoint: '/v1/majors',
        nameField: 'majorName',
    },
    category: {
        endpoint: '/v1/categories',
        nameField: 'categoryTitle',
    },
    skill: {
        endpoint: '/v1/jobs/skills',
        nameField: 'skillName',
    },
};

export function useAutofill<T extends AutofillItem>(entityType: string) {
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const config = entityConfigs[entityType];

    const fetchItems = async () => {
        if (!config) {
            console.error(`No configuration found for entity type: ${entityType}`);
            return;
        }

        try {
            setLoading(true);
            const response = await api.get(config.endpoint);
            if (response.status === 200) {
                setItems(response.data);
            }
        } catch (error) {
            console.error(`Error fetching ${entityType} data:`, error);
            notification.error({
                message: 'Lỗi',
                description: `Không thể tải danh sách ${entityType}. Vui lòng thử lại sau.`,
            });
        } finally {
            setLoading(false);
            setInitialized(true);
        }
    };

    const createItem = async (name: string): Promise<T | null> => {
        if (!config) {
            console.error(`No configuration found for entity type: ${entityType}`);
            return null;
        }

        try {
            setLoading(true);
            const data = { [config.nameField]: name };
            const createEndpoint = config.createEndpoint || config.endpoint;

            console.log(`Creating new ${entityType} with data:`, data);
            console.log(`Posting to endpoint:`, createEndpoint);

            const response = await api.post(createEndpoint, data);

            console.log(`Raw response from ${entityType} creation:`, response);

            if (response.status === 201 || response.status === 200) {
                let newItem;

                if (response.data && response.data.data && response.data.data.id) {
                    newItem = response.data.data;
                    console.log(`Found item in response.data.data:`, newItem);
                } else if (response.data && response.data.id) {
                    newItem = response.data;
                    console.log(`Found item in response.data:`, newItem);
                } else {
                    console.error(`Unexpected response format when creating ${entityType}:`, response);
                    notification.warning({
                        message: 'Cảnh báo',
                        description: `Đã tạo ${entityType} nhưng định dạng phản hồi không mong đợi. Hãy kiểm tra và làm mới trang.`,
                    });
                    return null;
                }

                if (!newItem.id) {
                    console.error(`Created ${entityType} but no ID was returned:`, newItem);
                    notification.warning({
                        message: 'Cảnh báo',
                        description: `Đã tạo ${entityType} nhưng không nhận được ID. Hãy kiểm tra và làm mới trang.`,
                    });
                    return null;
                }

                console.log(`Adding new ${entityType} to items list:`, newItem);
                setItems(prev => [...prev, newItem]);

                return newItem;
            }
        } catch (error) {
            console.error(`Error creating ${entityType}:`, error);
            notification.error({
                message: 'Lỗi',
                description: `Không thể tạo ${entityType} mới. Vui lòng thử lại sau.`,
            });
        } finally {
            setLoading(false);
        }

        return null;
    };

    useEffect(() => {
        if (!initialized && !loading) {
            fetchItems();
        }
    }, [initialized, loading]);

    const findItemByName = (name: string): T | undefined => {
        return items.find(item =>
            item[config.nameField].toLowerCase() === name.toLowerCase()
        );
    };

    const findItemById = (id: number): T | undefined => {
        return items.find(item => item.id === id);
    };

    const getItemName = (item: T): string => {
        return item[config.nameField];
    };

    const filterItems = (searchText: string, excludeIds?: number[]): T[] => {
        let filtered = items;
        if (searchText) {
            filtered = filtered.filter(item =>
                item[config.nameField].toLowerCase().includes(searchText.toLowerCase())
            );
        }
        if (excludeIds && excludeIds.length > 0) {
            filtered = filtered.filter(item => !excludeIds.includes(item.id));
        }

        return filtered;
    };

    return {
        items,
        loading,
        initialized,
        fetchItems,
        createItem,
        findItemByName,
        findItemById,
        getItemName,
        filterItems,
        config
    };
}

export interface AutofillInputProps {
    entityType: string;
    value: number;
    initialText: string;
    onChange: (id: number, name: string) => void;
    placeholder?: string;
    disabled?: boolean;
    excludeIds?: number[];
}



export function useAutofillInput(props: AutofillInputProps) {
    const { entityType, value, initialText, onChange, excludeIds } = props;
    const [searchText, setSearchText] = useState(initialText || '');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [lastId, setLastId] = useState<number | null>(value || null);
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const {
        loading,
        createItem,
        getItemName,
        filterItems,
        findItemById,
        findItemByName
    } = useAutofill(entityType);
    const filteredItems = filterItems(searchText, excludeIds);

    useEffect(() => {
        // Only update text from props when not actively editing
        if (!isEditing) {
            if (value && (!lastId || value !== lastId)) {
                const item = findItemById(value);
                if (item) {
                    setSearchText(getItemName(item));
                    setLastId(value);
                }
            } else if (initialText && initialText !== searchText) {
                setSearchText(initialText);

                // Check if this text matches an existing item
                const item = findItemByName(initialText);
                if (item && item.id !== lastId) {
                    setLastId(item.id);
                } else if (!item && lastId) {
                    setLastId(null);
                    onChange(0, initialText);
                }
            }
        }
    }, [initialText, value, findItemById, findItemByName, getItemName, lastId, searchText, onChange, isEditing]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
                setIsEditing(false); // End editing mode when clicking outside

                // When clicking outside, try to match text with an item
                // or create a new one if needed
                const trimmedText = searchText.trim();
                if (trimmedText) {
                    const matchingItem = findItemByName(trimmedText);
                    if (matchingItem) {
                        if (lastId !== matchingItem.id) {
                            setLastId(matchingItem.id);
                            onChange(matchingItem.id, getItemName(matchingItem));
                        }
                    } else {
                        // Text doesn't match any item - clear ID or could offer to create
                        if (lastId) {
                            setLastId(null);
                            onChange(0, trimmedText);
                        }
                    }
                } else if (lastId) {
                    // If text is empty, clear the ID
                    setLastId(null);
                    onChange(0, '');
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [findItemByName, getItemName, lastId, onChange, searchText]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setSearchText(newValue);
        setIsEditing(true); // Enter editing mode whenever typing

        // If user clears the input, also clear the ID
        if (!newValue.trim() && lastId) {
            setLastId(null);
            onChange(0, '');
        }

        // Always show dropdown when typing, unless input is empty
        if (!isDropdownOpen && newValue) {
            setIsDropdownOpen(true);
        } else if (isDropdownOpen && !newValue) {
            setIsDropdownOpen(false);
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
        if (!isDropdownOpen && inputRef.current) {
            inputRef.current.focus();
        }
    };

    const selectItem = (id: number, name: string) => {
        console.log(`Selecting item: ID=${id}, Name=${name}`);

        setSearchText(name);
        setLastId(id);
        setIsEditing(false); // Exit editing mode when item selected
        onChange(id, name);
        setIsDropdownOpen(false);

        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleCreateItem = async () => {
        if (!searchText.trim()) return;

        const newItem = await createItem(searchText.trim());
        if (newItem) {
            console.log('Created item to select:', newItem);

            const itemId = newItem.id;
            const itemName = getItemName(newItem);
            console.log(`Selecting newly created item: ID=${itemId}, Name=${itemName}`);

            selectItem(itemId, itemName);
        }
    };

    return {
        searchText,
        setSearchText,
        isDropdownOpen,
        setIsDropdownOpen,
        inputRef,
        dropdownRef,
        handleInputChange,
        toggleDropdown,
        selectItem,
        handleCreateItem,
        filteredItems,
        loading
    };
}

export default {
    useAutofill,
    useAutofillInput,
    entityConfigs
};