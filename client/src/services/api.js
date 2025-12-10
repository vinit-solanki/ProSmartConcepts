const API_BASE_URL = 'https://prosmart-concepts.vercel.app/api';

/**
 * Fetch all products from the API
 */
export const fetchProducts = async (filters) => {
  try {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
    }

    const url = `${API_BASE_URL}/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch products');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Fetch a single product by ID
 */
export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch product');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

/**
 * Fetch all categories with their subcategories and products
 */
export const fetchCategoriesWithProducts = async (opts) => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories-with-products`, {
      signal: opts?.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch categories');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching categories with products:', error);
    throw error;
  }
};

/**
 * Fetch all categories
 */
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch categories');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Fetch subcategories, optionally filtered by category_id
 */
export const fetchSubcategories = async (categoryId) => {
  try {
    const url = categoryId
      ? `${API_BASE_URL}/subcategories?category_id=${categoryId}`
      : `${API_BASE_URL}/subcategories`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch subcategories');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    throw error;
  }
};
