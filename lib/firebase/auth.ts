import { 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  type User,
  type AuthError
} from 'firebase/auth';
import { auth, googleProvider } from './client';

// Sign in with Google using popup
export const signInWithGooglePopup = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Get the ID token for the user
    const token = await result.user.getIdToken();
    
    console.log("Google sign-in successful!");
    
    return {
      success: true,
      user: result.user,
      token
    };
  } catch (error) {
    const authError = error as AuthError;
    console.error("Google sign-in failed:", authError.message);
    console.error("Error Code:", authError.code);
    
    return {
      success: false,
      error: {
        code: authError.code,
        message: authError.message,
        email: authError.customData?.email || null
      }
    };
  }
};

// Sign in with Google using redirect
export const signInWithGoogleRedirect = async () => {
  try {
    await signInWithRedirect(auth, googleProvider);
  } catch (error) {
    const authError = error as AuthError;
    console.error("Google redirect sign-in failed:", authError.message);
    throw authError;
  }
};

// Handle redirect result (call this on app load when using redirect)
export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    
    if (result) {
      const token = await result.user.getIdToken();
      
      console.log("Google sign-in redirect successful!");
      console.log("User:", result.user);
      console.log("ID Token:", token);
      
      return {
        success: true,
        user: result.user,
        token
      };
    }
    
    return { success: true, user: null, token: null };
  } catch (error) {
    const authError = error as AuthError;
    console.error("Google sign-in redirect failed:", authError.message);
    console.error("Error Code:", authError.code);
    
    return {
      success: false,
      error: {
        code: authError.code,
        message: authError.message,
        email: authError.customData?.email || null
      }
    };
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log("User signed out successfully");
    return { success: true };
  } catch (error) {
    const authError = error as AuthError;
    console.error("Sign out failed:", authError.message);
    return {
      success: false,
      error: {
        code: authError.code,
        message: authError.message
      }
    };
  }
};

// Auth state observer
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Get user ID token
export const getUserIdToken = async () => {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
};
