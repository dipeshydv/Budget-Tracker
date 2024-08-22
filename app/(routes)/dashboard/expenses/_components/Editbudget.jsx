"use client"
import { Button } from '@/components/ui/button'
import { PenBox } from 'lucide-react'
import React, { useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import EmojiPicker from 'emoji-picker-react'
import { useUser } from '@clerk/nextjs'
import { Input } from '@/components/ui/input'
import { db } from '@/utils/dbConfig'

function EditBudget({ budgetInfo }) {
    const [emojiIcon, setEmojiIcon] = useState('Choose');
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

    // Initialize state with budgetInfo values or empty strings
    const [name, setName] = useState(budgetInfo?.name || '');
    const [amount, setAmount] = useState(budgetInfo?.amount || '');

    const { user } = useUser();

    const onUpdateBudget = async () => {
        try {
            // Assuming 'db' is your database instance and 'Budget' is your model
            const result = await db.update(Budget).set({
                name: name,
                amount: amount,
                icon: emojiIcon
            }).where(eq(Budgets.id,budgetInfo.id))
            .returning(); // Assuming you're using an ID to target the specific budget
    
            // Optionally, handle success (e.g., close the dialog, show a notification)
            console.log('Budget updated successfully:', result);
        } catch (error) {
            // Handle any errors during the update process
            console.error('Error updating budget:', error);
        }
    }
    

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className='flex gap-2'><PenBox />Edit</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Budget</DialogTitle>
                        <DialogDescription>
                            <div className='mt-5'>
                                <Button
                                    variant="outline"
                                    className="text-lg"
                                    onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                                >
                                    {emojiIcon}
                                </Button>
                                {openEmojiPicker && (
                                    <div className='absolute'>
                                        <EmojiPicker
                                            onEmojiClick={(e) => {
                                                setEmojiIcon(e.emoji)
                                                setOpenEmojiPicker(false)
                                            }}
                                        />
                                    </div>
                                )}
                                <div className='mt-2'>
                                    <h2 className='text-black font-medium my-1'>Budget Name</h2>
                                    <Input
                                        placeholder="e.g. Fashion"
                                        defaultValue={budgetInfo?.name || ''}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className='mt-2'>
                                    <h2 className='text-black font-medium my-1'>Budget Amount</h2>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 5000$"
                                        defaultValue={budgetInfo?.amount || ''}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button
                                disabled={!(name && amount)}
                                onClick={onUpdateBudget}
                                className="mt-5 w-full"
                            >
                                Update Budget
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default EditBudget
