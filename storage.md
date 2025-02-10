# Unraid

## Parity

Unraid relies on 'even parity' for disk failure protection. Unraid stores the parity bits on a dedicated parity disk.   

The advantage of it: Unraid needs only one parity disk, independent of how many disks you have in your storage array. The only requirement is that the parity disk is equal or larger in size than the largest disk in the array.   

The disadvantage: Only one disk is allowed to fail (in default mode).   

> How does this work?  

Parity is calculated as even parity:  
SUM of disk bits must be even.  

|      | Disk1 | Disk2 | Disk3 | Disk4  | Parity |
| ---  | ---  | ---  | ---  | ---  | ---  |
| Bit 0 |   1    |   0    |    1   |    1    |  1 | 
| Bit 1 |   0    |   0    |    1   |    1    |  0  |

In case Disk 1 fails:

|      | Disk1  | Disk2 | Disk3 | Disk4  | Parity |
|  ---  | ---  | ---  | ---  | ---  | ---  |
| Bit 0 |   x1   |   0    |    1   |    1    |  1 | 
| Bit 1 |   x2   |   0    |    1   |    1    |  0 |

Reconstructing Disk1:  
x1:  x + 0 + 1 + 1 + 1 = even, x1 must be 1  
x2:  x + 0 + 1 + 1 + 0 = even, x2 must be 0

Unraid also allows dual parity - two parity disks - that protects against any two disk failures. 

<details>
<summary>Change parity disk?</summary>
<br>
1. Stop the array
2. Unassign the old parity disk
3. Assign the new parity disk
4. Start the array!
</details>

## Transfer data from external drives to Unraid

Goal: Data in one central deduplicated place, protected from disk failures.  

To mount external drives without assigning them to the array the *Unassigned Devices* App is necessary.  

With this App we also install *Unassigned Devices Preclear* to have *tmux* available on the Unraid server.  

Once *Unassigned Devices* is installed the USB-connected external drive will show up in the *Main* tab. By mounting it, it will be available under *mnt/disks/<Drivename>*. We can simply open a terminal in that location and preprocess folders before transferring them to the array. For example folders with large amounts of subfolders can be reduced to a single archive with tar, xz or zip.   

```
tar cf archive.tar folder 
(optional to also compress - T0 for multithreading: tar -c -I 'xz -T0' -f archive.tar.xz)
zip (-e for password protected archives) -r (recursive) <archive_name>.zip folder1 folder2 file3
```  

Once the data from the external drive is preprocessed, files can be transferred with the *Midnight Commander* by executing `mc` in the terminal.
